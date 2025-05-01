from odoo import models, fields, api, _
from odoo.exceptions import ValidationError, AccessError
import phonenumbers
import logging
_logger = logging.getLogger(__name__)

class CrmReceptionPhone(models.Model):
    _name = 'crm.reception.phone'
    _description = 'Reception Phone Numbers'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string="Phone Number", required=True, tracking=True)
    crm_lead_id = fields.Many2one('crm.lead', string="CRM Lead")
    reception_record_id = fields.Many2one('crm.reception', string="Reception Record")
    is_walk_in = fields.Boolean(string="Walk-in Customer", default=True)


class CrmReception(models.Model):
    _name = 'crm.reception'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _description = 'Reception CRM Lead'
    _rec_name = 'name'

    # Fields
    name = fields.Char(string='Lead Reference', compute="_compute_lead_name", store=True)
    customer_name = fields.Char(string='Customer Name', required=True, tracking=True)
    site_ids = fields.Many2many('property.site', string="Preferred Sites", tracking=True)
    country_id = fields.Many2one('res.country', string="Country", default=lambda self: self.env.ref('base.et').id)
    new_phone = fields.Char(string="Primary Phone", tracking=True)
    secondary_phone = fields.Char(string="Secondary Phone")
    phone_prefix = fields.Char(string="Phone Prefix", compute="_compute_phone_prefix")
    
    # Phone number tracking
    full_phone = fields.Many2many(
        'crm.reception.phone', 
        string="All Phone Numbers",
        help="List of all phone numbers associated with this customer"
    )
    
    # Source and user info
    source_id = fields.Many2one(
        'utm.source',
        string="Lead Source",
        default=lambda self: self._default_source_id(),
        tracking=True
    )
    is_reception_user = fields.Boolean(
        string="Is Reception User",
        compute="_compute_is_reception_user"
    )
    sales_person = fields.Many2one(
        'res.users',
        string="Receptionist",
        default=lambda self: self.env.user,
        readonly=True
    )
    
    # Assignment fields
    wing_id = fields.Many2one(
        'property.wing.config',
        string="Sales Wing",
        readonly=True
    )
    assigned_manager_id = fields.Many2one(
        'res.users',
        string="Assigned Manager",
        readonly=True
    )
    
    # Status and messaging
    phone_number_message = fields.Char(string="Phone Alert", readonly=True)
    state = fields.Selection([
        ('draft', 'New'),
        ('progress', 'In Progress'),
        ('done', 'Completed')
    ], string="Status", default='draft', tracking=True)

    # Computed Methods
    @api.depends('customer_name', 'site_ids')
    def _compute_lead_name(self):
        for rec in self:
            if rec.customer_name:
                site_names = '-'.join([site.name for site in rec.site_ids]) if rec.site_ids else ''
                rec.name = f'{rec.customer_name}-{site_names}' if site_names else rec.customer_name
            else:
                rec.name = "New Reception Lead"

    @api.depends('country_id')
    def _compute_phone_prefix(self):
        for rec in self:
            rec.phone_prefix = f"+{rec.country_id.phone_code}" if rec.country_id and rec.country_id.phone_code else ""

    @api.depends_context('uid')
    def _compute_is_reception_user(self):
        reception_group = self.env.ref('crm_custom_menu.group_reception', raise_if_not_found=False)
        for record in self:
            record.is_reception_user = reception_group and self.env.user in reception_group.users

    # Default Methods
    @api.model
    def _default_source_id(self):
        reception_group = self.env.ref('crm_custom_menu.group_reception', raise_if_not_found=False)
        if reception_group and self.env.user in reception_group.users:
            return self.env['utm.source'].search([('name', '=', 'Walk In')], limit=1).id
        return False

    # Constraints and Validations
    @api.constrains('source_id')
    def _check_source_id(self):
        reception_group = self.env.ref('crm_custom_menu.group_reception', raise_if_not_found=False)
        for record in self:
            if reception_group and self.env.user in reception_group.users:
                walk_in_source = self.env['utm.source'].search([('name', '=', 'Walk In')], limit=1)
                if record.source_id != walk_in_source:
                    raise AccessError(_('Reception users must keep the source as "Walk In"'))

    @api.onchange('new_phone')
    def _onchange_validate_phone(self):
        for record in self:
            if record.new_phone and record.country_id and record.country_id.code:
                try:
                    parsed = phonenumbers.parse(record.new_phone, record.country_id.code)
                    if not phonenumbers.is_valid_number(parsed):
                        raise ValidationError(_('Invalid phone number for selected country'))
                except Exception as e:
                    raise ValidationError(_('Invalid phone number format: %s') % str(e))

    # Action Methods
    def action_create_crm_lead(self):
        """Create CRM Lead from Reception record with Walk In source"""
        self.ensure_one()
        
        if not self.new_phone:
            raise ValidationError(_("Primary phone number is required"))
        
        # Clean and validate phone
        clean_phone = self._clean_phone_number(self.new_phone)
        
        # Get or create phone record
        phone_record = self._get_or_create_phone_record(clean_phone)
        
        # Get Walk In source
        walk_in_source = self.env['utm.source'].search([('name', '=', 'Walk In')], limit=1)
        if not walk_in_source:
            walk_in_source = self.env['utm.source'].create({'name': 'Walk In'})
        
        # Prepare lead values
        lead_values = {
            'name': self.name,
            'customer_name': self.customer_name.strip(),
            'phone_no': clean_phone,
            'phone_ids': [(4, phone_record.id)],
            'site_ids': [(6, 0, self.site_ids.ids)],
            'country_id': self.country_id.id,
            'source_id': walk_in_source.id,
            'user_id': self.assigned_manager_id.id or self.env.uid,
            'type': 'opportunity',
            'description': "Created from Reception (Walk-in Customer)",
        }
        
        # Create the lead
        lead = self.env['crm.lead'].create(lead_values)
        
        # Update phone record with references
        phone_record.write({
            'crm_lead_id': lead.id,
            'reception_record_id': self.id
        })
        
        # Update reception record state
        self.write({'state': 'done'})
        
        return {
            'name': _('CRM Lead'),
            'view_mode': 'form',
            'res_model': 'crm.lead',
            'res_id': lead.id,
            'type': 'ir.actions.act_window',
        }

    # Helper Methods
    def _clean_phone_number(self, phone):
        """Clean and standardize phone number format"""
        return phone.replace('+251', '').replace('251', '').strip()

    def _get_or_create_phone_record(self, phone_number):
        """Find or create phone record"""
        phone_record = self.env['crm.reception.phone'].search([
            ('name', 'ilike', phone_number)
        ], limit=1)
        
        if not phone_record:
            formatted_phone = f"+251{phone_number}"
            phone_record = self.env['crm.reception.phone'].create({
                'name': formatted_phone,
                'is_walk_in': True
            })
        return phone_record

    def _get_next_available_wing(self):
        """Distribute leads evenly among sales wings"""
        wings = self.env['property.wing.config'].search([('manager_id', '!=', False)], order='id')
        if not wings:
            return False
            
        # Find wing with fewest leads
        wing_counts = {}
        for wing in wings:
            wing_counts[wing.id] = self.search_count([
                ('assigned_manager_id', '=', wing.manager_id.id)
            ])
        
        min_count = min(wing_counts.values()) if wing_counts else 0
        available_wings = [w for w in wings if wing_counts.get(w.id, 0) == min_count]
        
        # Get next wing in rotation
        last_wing_id = int(self.env['ir.config_parameter'].sudo().get_param(
            'crm_reception.last_assigned_wing_id', 0))
        
        next_wing = available_wings[0]  # Default to first available
        
        if last_wing_id:
            last_wing = self.env['property.wing.config'].browse(last_wing_id)
            if last_wing.exists() and last_wing in available_wings:
                # Find next wing after last assigned
                next_wings = [w for w in available_wings if w.id > last_wing_id]
                next_wing = next_wings[0] if next_wings else available_wings[0]
        
        # Save for next assignment
        self.env['ir.config_parameter'].sudo().set_param(
            'crm_reception.last_assigned_wing_id', next_wing.id)
        
        return next_wing

    # CRUD Methods
    @api.model
    def create(self, vals):
        # Handle phone number
        if 'new_phone' in vals and vals['new_phone']:
            vals['phone_number_message'] = self._check_duplicate_phones(vals['new_phone'])
        
        # Set Walk In source for reception users
        reception_group = self.env.ref('crm_custom_menu.group_reception', raise_if_not_found=False)
        if reception_group and self.env.user in reception_group.users:
            walk_in_source = self.env['utm.source'].search([('name', '=', 'Walk In')], limit=1)
            if not walk_in_source:
                walk_in_source = self.env['utm.source'].create({'name': 'Walk In'})
            vals['source_id'] = walk_in_source.id
        
        # Assign wing and manager
        wing = self._get_next_available_wing()
        if wing:
            vals.update({
                'wing_id': wing.id,
                'assigned_manager_id': wing.manager_id.id
            })
        
        record = super(CrmReception, self).create(vals)
        
        # Create phone record if number provided
        if 'new_phone' in vals and vals['new_phone']:
            clean_phone = self._clean_phone_number(vals['new_phone'])
            phone_record = self._get_or_create_phone_record(clean_phone)
            record.full_phone = [(4, phone_record.id)]
        
        return record

    def write(self, vals):
        if 'new_phone' in vals and vals['new_phone']:
            vals['phone_number_message'] = self._check_duplicate_phones(vals['new_phone'])
            
            # Create/update phone record
            clean_phone = self._clean_phone_number(vals['new_phone'])
            phone_record = self._get_or_create_phone_record(clean_phone)
            vals['full_phone'] = [(4, phone_record.id)]
        
        return super(CrmReception, self).write(vals)

    def _check_duplicate_phones(self, phone_number):
        """Check for duplicate phone numbers across system"""
        clean_phone = self._clean_phone_number(phone_number)
        message = ""
        
        # Check in reception records
        reception_phone = self.env['crm.reception.phone'].search([
            ('name', 'ilike', clean_phone)
        ], limit=1)
        
        if reception_phone:
            reception_record = self.search([
                ('full_phone', 'in', reception_phone.ids)
            ], limit=1)
            if reception_record:
                message += _('Phone already registered with reception record for %s. ') % (
                    reception_record.customer_name or 'unknown customer')
        
        # Check in CRM leads
        crm_lead = self.env['crm.lead'].search([
            ('phone_no', 'ilike', clean_phone)
        ], limit=1)
        
        if crm_lead:
            message += _('Phone already registered in CRM for %s.') % (
                crm_lead.customer_name or 'unknown lead')
        
        return message if message else False