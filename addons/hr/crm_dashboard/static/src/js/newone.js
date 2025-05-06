// // // // // // /** @odoo-module **/

// // // // // // import { registry } from "@web/core/registry";
// // // // // // import { useService } from "@web/core/utils/hooks";
// // // // // // import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// // // // // // import { loadJS } from "@web/core/assets";
// // // // // // import { getColor } from "@web/core/colors/colors";

// // // // // // const actionRegistry = registry.category("actions");

// // // // // // export class ChartjsSampleCRM extends Component {
// // // // // //     setup() {
// // // // // //         this.orm = useService('orm');
// // // // // //         this.action = useService("action");
        
// // // // // //         // State management
// // // // // //         this.searchQuery = useState({ value: "" });
// // // // // //         this.dateFilters = useState({
// // // // // //             startDate: this.getDefaultStartDate(),
// // // // // //             endDate: this.getDefaultEndDate()
// // // // // //         });
// // // // // //         this.stats = useState({
// // // // // //             totalCallCenterLeads: 0,
// // // // // //             callCenterData: []
// // // // // //         });

// // // // // //         // Chart references
// // // // // //         this.barChartRef = useRef("barChart");
// // // // // //         this.pieChartRef = useRef("pieChart");
// // // // // //         this.barChart = null;
// // // // // //         this.pieChart = null;

// // // // // //         // Initial setup
// // // // // //         onWillStart(async () => {
// // // // // //             await loadJS(["/web/static/lib/Chart/Chart.js"]);
// // // // // //             await this.fetchStats();
// // // // // //         });

// // // // // //         onMounted(() => {
// // // // // //             this.renderCharts();
// // // // // //         });

// // // // // //         onWillUnmount(() => {
// // // // // //             if (this.barChart) this.barChart.destroy();
// // // // // //             if (this.pieChart) this.pieChart.destroy();
// // // // // //         });

// // // // // //         // Method binding
// // // // // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // // // // //         this.fetchStats = this.fetchStats.bind(this);
// // // // // //         this.renderCharts = this.renderCharts.bind(this);
// // // // // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // // // // //         this.applyDateFilter = this.applyDateFilter.bind(this);
// // // // // //         this.resetDateFilter = this.resetDateFilter.bind(this);
// // // // // //     }

// // // // // //     getDefaultStartDate() {
// // // // // //         const date = new Date();
// // // // // //         date.setMonth(date.getMonth() - 1);
// // // // // //         return date.toISOString().split('T')[0];
// // // // // //     }

// // // // // //     getDefaultEndDate() {
// // // // // //         return new Date().toISOString().split('T')[0];
// // // // // //     }

// // // // // //     async fetchStats() {
// // // // // //         // Get call center source ID
// // // // // //         const callCenterSource = await this.orm.search(
// // // // // //             "utm.source", 
// // // // // //             [['name', '=', '6033']], 
// // // // // //             { limit: 1 }
// // // // // //         );
        
// // // // // //         if (callCenterSource.length === 0) return;
        
// // // // // //         // Build domain with date filters
// // // // // //         const domain = [['source_id', '=', callCenterSource[0]]];
        
// // // // // //         if (this.dateFilters.startDate) {
// // // // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // // // //         }
// // // // // //         if (this.dateFilters.endDate) {
// // // // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // // // //         }
        
// // // // // //         // Get counts and data
// // // // // //         const [totalCallCenterLeads, callCenterData] = await Promise.all([
// // // // // //             this.orm.searchCount("crm.lead", domain),
// // // // // //             this.orm.readGroup(
// // // // // //                 "crm.lead",
// // // // // //                 domain,
// // // // // //                 ['stage_id'],
// // // // // //                 ['stage_id']
// // // // // //             )
// // // // // //         ]);

// // // // // //         this.stats.totalCallCenterLeads = totalCallCenterLeads;
// // // // // //         this.stats.callCenterData = callCenterData;
// // // // // //     }

// // // // // //     renderCharts() {
// // // // // //         if (!this.stats.callCenterData.length) return;

// // // // // //         const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
// // // // // //         const data = this.stats.callCenterData.map(item => item.stage_id_count);
// // // // // //         const backgroundColors = labels.map((_, index) => getColor(index));

// // // // // //         // Destroy existing charts
// // // // // //         if (this.barChart) this.barChart.destroy();
// // // // // //         if (this.pieChart) this.pieChart.destroy();

// // // // // //         // Bar Chart
// // // // // //         this.barChart = new Chart(this.barChartRef.el, {
// // // // // //             type: "bar",
// // // // // //             data: {
// // // // // //                 labels: labels,
// // // // // //                 datasets: [{
// // // // // //                     label: 'Leads by Stage',
// // // // // //                     data: data,
// // // // // //                     backgroundColor: backgroundColors,
// // // // // //                     borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
// // // // // //                     borderWidth: 1
// // // // // //                 }]
// // // // // //             },
// // // // // //             options: {
// // // // // //                 responsive: true,
// // // // // //                 maintainAspectRatio: false,
// // // // // //                 scales: {
// // // // // //                     y: {
// // // // // //                         beginAtZero: true
// // // // // //                     }
// // // // // //                 }
// // // // // //             }
// // // // // //         });

// // // // // //         // Pie Chart
// // // // // //         this.pieChart = new Chart(this.pieChartRef.el, {
// // // // // //             type: "pie",
// // // // // //             data: {
// // // // // //                 labels: labels,
// // // // // //                 datasets: [{
// // // // // //                     data: data,
// // // // // //                     backgroundColor: backgroundColors,
// // // // // //                     borderWidth: 1
// // // // // //                 }]
// // // // // //             },
// // // // // //             options: {
// // // // // //                 responsive: true,
// // // // // //                 maintainAspectRatio: false
// // // // // //             }
// // // // // //         });
// // // // // //     }

// // // // // //     async applyDateFilter() {
// // // // // //         await this.fetchStats();
// // // // // //         this.renderCharts();
// // // // // //     }

// // // // // //     async resetDateFilter() {
// // // // // //         this.dateFilters.startDate = this.getDefaultStartDate();
// // // // // //         this.dateFilters.endDate = this.getDefaultEndDate();
// // // // // //         await this.fetchStats();
// // // // // //         this.renderCharts();
// // // // // //     }

// // // // // //     onSearchQueryChange(event) {
// // // // // //         this.searchQuery.value = event.target.value;
// // // // // //     }

// // // // // //     goToCRMPage(filter) {
// // // // // //         const domain = [["source_id.name", "=", "6033"]];
        
// // // // // //         // Apply date filters to the action as well
// // // // // //         if (this.dateFilters.startDate) {
// // // // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // // // //         }
// // // // // //         if (this.dateFilters.endDate) {
// // // // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // // // //         }

// // // // // //         this.action.doAction({
// // // // // //             type: "ir.actions.act_window",
// // // // // //             res_model: "crm.lead",
// // // // // //             view_mode: "list",
// // // // // //             views: [[false, "list"]],
// // // // // //             target: "current",
// // // // // //             domain: domain,
// // // // // //         });
// // // // // //     }
// // // // // // }

// // // // // // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// // // // // // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);





// // // // // /** @odoo-module **/

// // // // // import { registry } from "@web/core/registry";
// // // // // import { useService } from "@web/core/utils/hooks";
// // // // // import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// // // // // import { loadJS } from "@web/core/assets";
// // // // // import { getColor } from "@web/core/colors/colors";

// // // // // const actionRegistry = registry.category("actions");

// // // // // export class ChartjsSampleCRM extends Component {
// // // // //     setup() {
// // // // //         this.orm = useService('orm');
// // // // //         this.action = useService("action");
        
// // // // //         // State management
// // // // //         this.searchQuery = useState({ value: "" });
// // // // //         this.dateFilters = useState({
// // // // //             startDate: this.getDefaultStartDate(),
// // // // //             endDate: this.getDefaultEndDate()
// // // // //         });
// // // // //         this.stats = useState({
// // // // //             totalCallCenterLeads: 0,
// // // // //             totalLeads: 0,
// // // // //             callCenterData: [],
// // // // //             leadDataBySource: [],
// // // // //             leadDataByStage: []
// // // // //         });

// // // // //         // Chart references
// // // // //         this.barChartRef = useRef("barChart");
// // // // //         this.pieChartRef = useRef("pieChart");
// // // // //         this.sourceChartRef = useRef("sourceChart");
// // // // //         this.stageChartRef = useRef("stageChart");
// // // // //         this.barChart = null;
// // // // //         this.pieChart = null;
// // // // //         this.sourceChart = null;
// // // // //         this.stageChart = null;

// // // // //         // Initial setup
// // // // //         onWillStart(async () => {
// // // // //             await loadJS(["/web/static/lib/Chart/Chart.js"]);
// // // // //             await this.fetchStats();
// // // // //         });

// // // // //         onMounted(() => {
// // // // //             this.renderCharts();
// // // // //         });

// // // // //         onWillUnmount(() => {
// // // // //             if (this.barChart) this.barChart.destroy();
// // // // //             if (this.pieChart) this.pieChart.destroy();
// // // // //             if (this.sourceChart) this.sourceChart.destroy();
// // // // //             if (this.stageChart) this.stageChart.destroy();
// // // // //         });

// // // // //         // Method binding
// // // // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // // // //         this.fetchStats = this.fetchStats.bind(this);
// // // // //         this.renderCharts = this.renderCharts.bind(this);
// // // // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // // // //         this.applyDateFilter = this.applyDateFilter.bind(this);
// // // // //         this.resetDateFilter = this.resetDateFilter.bind(this);
// // // // //     }

// // // // //     getDefaultStartDate() {
// // // // //         const date = new Date();
// // // // //         date.setMonth(date.getMonth() - 1);
// // // // //         return date.toISOString().split('T')[0];
// // // // //     }

// // // // //     getDefaultEndDate() {
// // // // //         return new Date().toISOString().split('T')[0];
// // // // //     }

// // // // //     async fetchStats() {
// // // // //         // Get call center source ID
// // // // //         const callCenterSource = await this.orm.search(
// // // // //             "utm.source", 
// // // // //             [['name', '=', '6033']], 
// // // // //             { limit: 1 }
// // // // //         );
        
// // // // //         // Build domain with date filters
// // // // //         const domain = [];
// // // // //         const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
        
// // // // //         if (this.dateFilters.startDate) {
// // // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // // //             if (callCenterSource.length) {
// // // // //                 callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // // //             }
// // // // //         }
// // // // //         if (this.dateFilters.endDate) {
// // // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // // //             if (callCenterSource.length) {
// // // // //                 callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // // //             }
// // // // //         }
        
// // // // //         // Get counts and data
// // // // //         const [totalCallCenterLeads, totalLeads, callCenterData, leadDataBySource, leadDataByStage] = await Promise.all([
// // // // //             callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
// // // // //             this.orm.searchCount("crm.lead", domain),
// // // // //             callCenterSource.length ? this.orm.readGroup(
// // // // //                 "crm.lead",
// // // // //                 callCenterDomain,
// // // // //                 ['stage_id'],
// // // // //                 ['stage_id']
// // // // //             ) : [],
// // // // //             this.orm.readGroup(
// // // // //                 "crm.lead",
// // // // //                 domain,
// // // // //                 ['source_id'],
// // // // //                 ['source_id']
// // // // //             ),
// // // // //             this.orm.readGroup(
// // // // //                 "crm.lead",
// // // // //                 domain,
// // // // //                 ['stage_id'],
// // // // //                 ['stage_id']
// // // // //             )
// // // // //         ]);

// // // // //         this.stats.totalCallCenterLeads = totalCallCenterLeads;
// // // // //         this.stats.totalLeads = totalLeads;
// // // // //         this.stats.callCenterData = callCenterData;
// // // // //         this.stats.leadDataBySource = leadDataBySource;
// // // // //         this.stats.leadDataByStage = leadDataByStage;
// // // // //     }

// // // // //     renderCharts() {
// // // // //         // Destroy existing charts
// // // // //         if (this.barChart) this.barChart.destroy();
// // // // //         if (this.pieChart) this.pieChart.destroy();
// // // // //         if (this.sourceChart) this.sourceChart.destroy();
// // // // //         if (this.stageChart) this.stageChart.destroy();

// // // // //         // Call Center Charts
// // // // //         if (this.stats.callCenterData.length) {
// // // // //             const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
// // // // //             const data = this.stats.callCenterData.map(item => item.stage_id_count);
// // // // //             const backgroundColors = labels.map((_, index) => getColor(index));

// // // // //             // Bar Chart
// // // // //             this.barChart = new Chart(this.barChartRef.el, {
// // // // //                 type: "bar",
// // // // //                 data: {
// // // // //                     labels: labels,
// // // // //                     datasets: [{
// // // // //                         label: 'Call Center Leads by Stage',
// // // // //                         data: data,
// // // // //                         backgroundColor: backgroundColors,
// // // // //                         borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
// // // // //                         borderWidth: 1
// // // // //                     }]
// // // // //                 },
// // // // //                 options: {
// // // // //                     responsive: true,
// // // // //                     maintainAspectRatio: false,
// // // // //                     scales: {
// // // // //                         y: {
// // // // //                             beginAtZero: true
// // // // //                         }
// // // // //                     }
// // // // //                 }
// // // // //             });

// // // // //             // Pie Chart
// // // // //             this.pieChart = new Chart(this.pieChartRef.el, {
// // // // //                 type: "pie",
// // // // //                 data: {
// // // // //                     labels: labels,
// // // // //                     datasets: [{
// // // // //                         data: data,
// // // // //                         backgroundColor: backgroundColors,
// // // // //                         borderWidth: 1
// // // // //                     }]
// // // // //                 },
// // // // //                 options: {
// // // // //                     responsive: true,
// // // // //                     maintainAspectRatio: false
// // // // //                 }
// // // // //             });
// // // // //         }

// // // // //         // All Leads Charts
// // // // //         if (this.stats.leadDataBySource.length) {
// // // // //             const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
// // // // //             const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
// // // // //             const sourceColors = sourceLabels.map((_, index) => getColor(index + 5)); // Offset colors

// // // // //             this.sourceChart = new Chart(this.sourceChartRef.el, {
// // // // //                 type: "doughnut",
// // // // //                 data: {
// // // // //                     labels: sourceLabels,
// // // // //                     datasets: [{
// // // // //                         data: sourceData,
// // // // //                         backgroundColor: sourceColors,
// // // // //                         borderWidth: 1
// // // // //                     }]
// // // // //                 },
// // // // //                 options: {
// // // // //                     responsive: true,
// // // // //                     maintainAspectRatio: false,
// // // // //                     title: {
// // // // //                         display: true,
// // // // //                         text: 'Leads by Source'
// // // // //                     }
// // // // //                 }
// // // // //             });
// // // // //         }

// // // // //         if (this.stats.leadDataByStage.length) {
// // // // //             const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
// // // // //             const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
// // // // //             const stageColors = stageLabels.map((_, index) => getColor(index + 10)); // Offset colors

// // // // //             this.stageChart = new Chart(this.stageChartRef.el, {
// // // // //                 type: "bar",
// // // // //                 data: {
// // // // //                     labels: stageLabels,
// // // // //                     datasets: [{
// // // // //                         label: 'All Leads by Stage',
// // // // //                         data: stageData,
// // // // //                         backgroundColor: stageColors,
// // // // //                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
// // // // //                         borderWidth: 1
// // // // //                     }]
// // // // //                 },
// // // // //                 options: {
// // // // //                     responsive: true,
// // // // //                     maintainAspectRatio: false,
// // // // //                     scales: {
// // // // //                         y: {
// // // // //                             beginAtZero: true
// // // // //                         }
// // // // //                     }
// // // // //                 }
// // // // //             });
// // // // //         }
// // // // //     }

// // // // //     async applyDateFilter() {
// // // // //         await this.fetchStats();
// // // // //         this.renderCharts();
// // // // //     }

// // // // //     async resetDateFilter() {
// // // // //         this.dateFilters.startDate = this.getDefaultStartDate();
// // // // //         this.dateFilters.endDate = this.getDefaultEndDate();
// // // // //         await this.fetchStats();
// // // // //         this.renderCharts();
// // // // //     }

// // // // //     onSearchQueryChange(event) {
// // // // //         this.searchQuery.value = event.target.value;
// // // // //     }

// // // // //     goToCRMPage(filter) {
// // // // //         const domain = [];
        
// // // // //         if (filter === 'callcenter') {
// // // // //             domain.push(["source_id.name", "=", "6033"]);
// // // // //         }
        
// // // // //         // Apply date filters to the action as well
// // // // //         if (this.dateFilters.startDate) {
// // // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // // //         }
// // // // //         if (this.dateFilters.endDate) {
// // // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // // //         }

// // // // //         this.action.doAction({
// // // // //             type: "ir.actions.act_window",
// // // // //             res_model: "crm.lead",
// // // // //             view_mode: "list",
// // // // //             views: [[false, "list"]],
// // // // //             target: "current",
// // // // //             domain: domain,
// // // // //         });
// // // // //     }
// // // // // }

// // // // // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// // // // // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);


// // // // /** @odoo-module **/

// // // // import { registry } from "@web/core/registry";
// // // // import { useService } from "@web/core/utils/hooks";
// // // // import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// // // // import { loadJS } from "@web/core/assets";
// // // // import { getColor } from "@web/core/colors/colors";

// // // // const actionRegistry = registry.category("actions");

// // // // export class ChartjsSampleCRM extends Component {
// // // //     setup() {
// // // //         this.orm = useService('orm');
// // // //         this.action = useService("action");
        
// // // //         // State management
// // // //         this.searchQuery = useState({ value: "" });
// // // //         this.dateFilters = useState({
// // // //             startDate: this.getDefaultStartDate(),
// // // //             endDate: this.getDefaultEndDate()
// // // //         });
// // // //         this.stats = useState({
// // // //             totalCallCenterLeads: 0,
// // // //             totalLeads: 0,
// // // //             totalCustomers: 0,
// // // //             callCenterData: [],
// // // //             leadDataBySource: [],
// // // //             leadDataByStage: [],
// // // //             customerDataByType: []
// // // //         });

// // // //         // Chart references
// // // //         this.barChartRef = useRef("barChart");
// // // //         this.pieChartRef = useRef("pieChart");
// // // //         this.sourceChartRef = useRef("sourceChart");
// // // //         this.stageChartRef = useRef("stageChart");
// // // //         this.customerTypeChartRef = useRef("customerTypeChart");
// // // //         this.customerStageChartRef = useRef("customerStageChart");
// // // //         this.barChart = null;
// // // //         this.pieChart = null;
// // // //         this.sourceChart = null;
// // // //         this.stageChart = null;
// // // //         this.customerTypeChart = null;
// // // //         this.customerStageChart = null;

// // // //         // Initial setup
// // // //         onWillStart(async () => {
// // // //             await loadJS(["/web/static/lib/Chart/Chart.js"]);
// // // //             await this.fetchStats();
// // // //         });

// // // //         onMounted(() => {
// // // //             this.renderCharts();
// // // //             this.setupChartResizeListeners();
// // // //         });

// // // //         onWillUnmount(() => {
// // // //             if (this.barChart) this.barChart.destroy();
// // // //             if (this.pieChart) this.pieChart.destroy();
// // // //             if (this.sourceChart) this.sourceChart.destroy();
// // // //             if (this.stageChart) this.stageChart.destroy();
// // // //             if (this.customerTypeChart) this.customerTypeChart.destroy();
// // // //             if (this.customerStageChart) this.customerStageChart.destroy();
// // // //             window.removeEventListener('resize', this.handleResize);
// // // //         });

// // // //         // Method binding
// // // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // // //         this.goToCustomerPage = this.goToCustomerPage.bind(this);
// // // //         this.fetchStats = this.fetchStats.bind(this);
// // // //         this.renderCharts = this.renderCharts.bind(this);
// // // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // // //         this.applyDateFilter = this.applyDateFilter.bind(this);
// // // //         this.resetDateFilter = this.resetDateFilter.bind(this);
// // // //         this.handleResize = this.handleResize.bind(this);
// // // //     }

// // // //     setupChartResizeListeners() {
// // // //         window.addEventListener('resize', this.handleResize);
// // // //     }

// // // //     handleResize() {
// // // //         // Debounce chart resizing to prevent performance issues
// // // //         clearTimeout(this.resizeTimer);
// // // //         this.resizeTimer = setTimeout(() => {
// // // //             this.renderCharts();
// // // //         }, 200);
// // // //     }

// // // //     getDefaultStartDate() {
// // // //         const date = new Date();
// // // //         date.setMonth(date.getMonth() - 1);
// // // //         return date.toISOString().split('T')[0];
// // // //     }

// // // //     getDefaultEndDate() {
// // // //         return new Date().toISOString().split('T')[0];
// // // //     }

// // // //     async fetchStats() {
// // // //         // Get call center source ID
// // // //         const callCenterSource = await this.orm.search(
// // // //             "utm.source", 
// // // //             [['name', '=', '6033']], 
// // // //             { limit: 1 }
// // // //         );
        
// // // //         // Build domains with date filters
// // // //         const leadDomain = [];
// // // //         const customerDomain = [];
// // // //         const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
        
// // // //         if (this.dateFilters.startDate) {
// // // //             leadDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // //             customerDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // //             if (callCenterSource.length) {
// // // //                 callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // //             }
// // // //         }
// // // //         if (this.dateFilters.endDate) {
// // // //             leadDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // //             customerDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // //             if (callCenterSource.length) {
// // // //                 callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // //             }
// // // //         }
        
// // // //         // Get counts and data
// // // //         const [
// // // //             totalCallCenterLeads, 
// // // //             totalLeads, 
// // // //             totalCustomers,
// // // //             callCenterData, 
// // // //             leadDataBySource, 
// // // //             leadDataByStage,
// // // //             customerDataByType,
// // // //             customerDataByStage
// // // //         ] = await Promise.all([
// // // //             callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
// // // //             this.orm.searchCount("crm.lead", leadDomain),
// // // //             this.orm.searchCount("res.partner", [...customerDomain, ['customer_rank', '>', 0]]),
// // // //             callCenterSource.length ? this.orm.readGroup(
// // // //                 "crm.lead",
// // // //                 callCenterDomain,
// // // //                 ['stage_id'],
// // // //                 ['stage_id']
// // // //             ) : [],
// // // //             this.orm.readGroup(
// // // //                 "crm.lead",
// // // //                 leadDomain,
// // // //                 ['source_id'],
// // // //                 ['source_id']
// // // //             ),
// // // //             this.orm.readGroup(
// // // //                 "crm.lead",
// // // //                 leadDomain,
// // // //                 ['stage_id'],
// // // //                 ['stage_id']
// // // //             ),
// // // //             this.orm.readGroup(
// // // //                 "res.partner",
// // // //                 [...customerDomain, ['customer_rank', '>', 0]],
// // // //                 ['company_type'],
// // // //                 ['company_type']
// // // //             ),
// // // //             this.orm.readGroup(
// // // //                 "res.partner",
// // // //                 [...customerDomain, ['customer_rank', '>', 0]],
// // // //                 ['stage_id'],
// // // //                 ['stage_id']
// // // //             )
// // // //         ]);

// // // //         this.stats.totalCallCenterLeads = totalCallCenterLeads;
// // // //         this.stats.totalLeads = totalLeads;
// // // //         this.stats.totalCustomers = totalCustomers;
// // // //         this.stats.callCenterData = callCenterData;
// // // //         this.stats.leadDataBySource = leadDataBySource;
// // // //         this.stats.leadDataByStage = leadDataByStage;
// // // //         this.stats.customerDataByType = customerDataByType;
// // // //         this.stats.customerDataByStage = customerDataByStage;
// // // //     }

// // // //     renderCharts() {
// // // //         // Destroy existing charts
// // // //         if (this.barChart) this.barChart.destroy();
// // // //         if (this.pieChart) this.pieChart.destroy();
// // // //         if (this.sourceChart) this.sourceChart.destroy();
// // // //         if (this.stageChart) this.stageChart.destroy();
// // // //         if (this.customerTypeChart) this.customerTypeChart.destroy();
// // // //         if (this.customerStageChart) this.customerStageChart.destroy();

// // // //         // Call Center Charts
// // // //         if (this.stats.callCenterData.length) {
// // // //             const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
// // // //             const data = this.stats.callCenterData.map(item => item.stage_id_count);
// // // //             const backgroundColors = labels.map((_, index) => getColor(index));

// // // //             // Bar Chart
// // // //             this.barChart = new Chart(this.barChartRef.el, {
// // // //                 type: "bar",
// // // //                 data: {
// // // //                     labels: labels,
// // // //                     datasets: [{
// // // //                         label: 'Call Center Leads by Stage',
// // // //                         data: data,
// // // //                         backgroundColor: backgroundColors,
// // // //                         borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     scales: {
// // // //                         y: {
// // // //                             beginAtZero: true
// // // //                         }
// // // //                     },
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });

// // // //             // Pie Chart
// // // //             this.pieChart = new Chart(this.pieChartRef.el, {
// // // //                 type: "pie",
// // // //                 data: {
// // // //                     labels: labels,
// // // //                     datasets: [{
// // // //                         data: data,
// // // //                         backgroundColor: backgroundColors,
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });
// // // //         }

// // // //         // All Leads Charts
// // // //         if (this.stats.leadDataBySource.length) {
// // // //             const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
// // // //             const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
// // // //             const sourceColors = sourceLabels.map((_, index) => getColor(index + 5));

// // // //             this.sourceChart = new Chart(this.sourceChartRef.el, {
// // // //                 type: "doughnut",
// // // //                 data: {
// // // //                     labels: sourceLabels,
// // // //                     datasets: [{
// // // //                         data: sourceData,
// // // //                         backgroundColor: sourceColors,
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });
// // // //         }

// // // //         if (this.stats.leadDataByStage.length) {
// // // //             const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
// // // //             const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
// // // //             const stageColors = stageLabels.map((_, index) => getColor(index + 10));

// // // //             this.stageChart = new Chart(this.stageChartRef.el, {
// // // //                 type: "bar",
// // // //                 data: {
// // // //                     labels: stageLabels,
// // // //                     datasets: [{
// // // //                         label: 'All Leads by Stage',
// // // //                         data: stageData,
// // // //                         backgroundColor: stageColors,
// // // //                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     scales: {
// // // //                         y: {
// // // //                             beginAtZero: true
// // // //                         }
// // // //                     },
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });
// // // //         }

// // // //         // Customer Charts
// // // //         if (this.stats.customerDataByType.length) {
// // // //             const typeLabels = this.stats.customerDataByType.map(item => item.company_type === 'company' ? 'Company' : 'Individual');
// // // //             const typeData = this.stats.customerDataByType.map(item => item.company_type_count);
// // // //             const typeColors = ['#3b82f6', '#10b981'];

// // // //             this.customerTypeChart = new Chart(this.customerTypeChartRef.el, {
// // // //                 type: "pie",
// // // //                 data: {
// // // //                     labels: typeLabels,
// // // //                     datasets: [{
// // // //                         data: typeData,
// // // //                         backgroundColor: typeColors,
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });
// // // //         }

// // // //         if (this.stats.customerDataByStage.length) {
// // // //             const stageLabels = this.stats.customerDataByStage.map(item => item.stage_id ? item.stage_id[1] : 'No Stage');
// // // //             const stageData = this.stats.customerDataByStage.map(item => item.stage_id_count);
// // // //             const stageColors = stageLabels.map((_, index) => getColor(index + 15));

// // // //             this.customerStageChart = new Chart(this.customerStageChartRef.el, {
// // // //                 type: "bar",
// // // //                 data: {
// // // //                     labels: stageLabels,
// // // //                     datasets: [{
// // // //                         label: 'Customers by Stage',
// // // //                         data: stageData,
// // // //                         backgroundColor: stageColors,
// // // //                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
// // // //                         borderWidth: 1
// // // //                     }]
// // // //                 },
// // // //                 options: {
// // // //                     responsive: true,
// // // //                     maintainAspectRatio: false,
// // // //                     scales: {
// // // //                         y: {
// // // //                             beginAtZero: true
// // // //                         }
// // // //                     },
// // // //                     animation: {
// // // //                         duration: 0 // Disable animations to prevent movement
// // // //                     }
// // // //                 }
// // // //             });
// // // //         }
// // // //     }

// // // //     async applyDateFilter() {
// // // //         await this.fetchStats();
// // // //         this.renderCharts();
// // // //     }

// // // //     async resetDateFilter() {
// // // //         this.dateFilters.startDate = this.getDefaultStartDate();
// // // //         this.dateFilters.endDate = this.getDefaultEndDate();
// // // //         await this.fetchStats();
// // // //         this.renderCharts();
// // // //     }

// // // //     onSearchQueryChange(event) {
// // // //         this.searchQuery.value = event.target.value;
// // // //     }

// // // //     goToCRMPage(filter) {
// // // //         const domain = [];
        
// // // //         if (filter === 'callcenter') {
// // // //             domain.push(["source_id.name", "=", "6033"]);
// // // //         }
        
// // // //         // Apply date filters to the action as well
// // // //         if (this.dateFilters.startDate) {
// // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // //         }
// // // //         if (this.dateFilters.endDate) {
// // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // //         }

// // // //         this.action.doAction({
// // // //             type: "ir.actions.act_window",
// // // //             res_model: "crm.lead",
// // // //             view_mode: "list",
// // // //             views: [[false, "list"]],
// // // //             target: "current",
// // // //             domain: domain,
// // // //         });
// // // //     }

// // // //     goToCustomerPage() {
// // // //         const domain = [['customer_rank', '>', 0]];
        
// // // //         // Apply date filters to the action as well
// // // //         if (this.dateFilters.startDate) {
// // // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // // //         }
// // // //         if (this.dateFilters.endDate) {
// // // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // // //         }

// // // //         this.action.doAction({
// // // //             type: "ir.actions.act_window",
// // // //             res_model: "res.partner",
// // // //             view_mode: "list",
// // // //             views: [[false, "list"]],
// // // //             target: "current",
// // // //             domain: domain,
// // // //         });
// // // //     }
// // // // }

// // // // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// // // // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);



// // // /** @odoo-module **/

// // // import { registry } from "@web/core/registry";
// // // import { useService } from "@web/core/utils/hooks";
// // // import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// // // import { loadJS } from "@web/core/assets";
// // // import { getColor } from "@web/core/colors/colors";

// // // const actionRegistry = registry.category("actions");

// // // export class ChartjsSampleCRM extends Component {
// // //     setup() {
// // //         this.orm = useService('orm');
// // //         this.action = useService("action");
        
// // //         // State management
// // //         this.searchQuery = useState({ value: "" });
// // //         this.dateFilters = useState({
// // //             startDate: this.getDefaultStartDate(),
// // //             endDate: this.getDefaultEndDate()
// // //         });
// // //         this.stats = useState({
// // //             totalCallCenterLeads: 0,
// // //             totalLeads: 0,
// // //             totalCustomers: 0,
// // //             callCenterData: [],
// // //             leadDataBySource: [],
// // //             leadDataByStage: [],
// // //             customerDataByCountry: []
// // //         });

// // //         // Chart references
// // //         this.barChartRef = useRef("barChart");
// // //         this.pieChartRef = useRef("pieChart");
// // //         this.sourceChartRef = useRef("sourceChart");
// // //         this.stageChartRef = useRef("stageChart");
// // //         this.customerCountryChartRef = useRef("customerCountryChart");
// // //         this.barChart = null;
// // //         this.pieChart = null;
// // //         this.sourceChart = null;
// // //         this.stageChart = null;
// // //         this.customerCountryChart = null;

// // //         // Initial setup
// // //         onWillStart(async () => {
// // //             await loadJS(["/web/static/lib/Chart/Chart.js"]);
// // //             await this.fetchStats();
// // //         });

// // //         onMounted(() => {
// // //             this.renderCharts();
// // //             this.setupChartResizeListeners();
// // //         });

// // //         onWillUnmount(() => {
// // //             this.destroyAllCharts();
// // //             window.removeEventListener('resize', this.handleResize);
// // //         });

// // //         // Method binding
// // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // //         this.goToCustomerPage = this.goToCustomerPage.bind(this);
// // //         this.fetchStats = this.fetchStats.bind(this);
// // //         this.renderCharts = this.renderCharts.bind(this);
// // //         this.destroyAllCharts = this.destroyAllCharts.bind(this);
// // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // //         this.applyDateFilter = this.applyDateFilter.bind(this);
// // //         this.resetDateFilter = this.resetDateFilter.bind(this);
// // //         this.handleResize = this.handleResize.bind(this);
// // //     }

// // //     destroyAllCharts() {
// // //         if (this.barChart) this.barChart.destroy();
// // //         if (this.pieChart) this.pieChart.destroy();
// // //         if (this.sourceChart) this.sourceChart.destroy();
// // //         if (this.stageChart) this.stageChart.destroy();
// // //         if (this.customerCountryChart) this.customerCountryChart.destroy();
// // //     }

// // //     setupChartResizeListeners() {
// // //         window.addEventListener('resize', this.handleResize);
// // //     }

// // //     handleResize() {
// // //         clearTimeout(this.resizeTimer);
// // //         this.resizeTimer = setTimeout(() => {
// // //             this.renderCharts();
// // //         }, 200);
// // //     }

// // //     getDefaultStartDate() {
// // //         const date = new Date();
// // //         date.setMonth(date.getMonth() - 1);
// // //         return date.toISOString().split('T')[0];
// // //     }

// // //     getDefaultEndDate() {
// // //         return new Date().toISOString().split('T')[0];
// // //     }

// // //     async fetchStats() {
// // //         try {
// // //             // Get call center source ID
// // //             const callCenterSource = await this.orm.search(
// // //                 "utm.source", 
// // //                 [['name', '=', '6033']], 
// // //                 { limit: 1 }
// // //             );
            
// // //             // Build domains with date filters
// // //             const leadDomain = [];
// // //             const customerDomain = [];
// // //             const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
            
// // //             if (this.dateFilters.startDate) {
// // //                 leadDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // //                 customerDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // //                 if (callCenterSource.length) {
// // //                     callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// // //                 }
// // //             }
// // //             if (this.dateFilters.endDate) {
// // //                 leadDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // //                 customerDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // //                 if (callCenterSource.length) {
// // //                     callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // //                 }
// // //             }
            
// // //             // Get counts and data
// // //             const [
// // //                 totalCallCenterLeads, 
// // //                 totalLeads, 
// // //                 totalCustomers,
// // //                 callCenterData, 
// // //                 leadDataBySource, 
// // //                 leadDataByStage,
// // //                 customerDataByCountry
// // //             ] = await Promise.all([
// // //                 callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
// // //                 this.orm.searchCount("crm.lead", leadDomain),
// // //                 this.orm.searchCount("res.partner", [...customerDomain, ['customer_rank', '>', 0]]),
// // //                 callCenterSource.length ? this.orm.readGroup(
// // //                     "crm.lead",
// // //                     callCenterDomain,
// // //                     ['stage_id'],
// // //                     ['stage_id']
// // //                 ) : [],
// // //                 this.orm.readGroup(
// // //                     "crm.lead",
// // //                     leadDomain,
// // //                     ['source_id'],
// // //                     ['source_id']
// // //                 ),
// // //                 this.orm.readGroup(
// // //                     "crm.lead",
// // //                     leadDomain,
// // //                     ['stage_id'],
// // //                     ['stage_id']
// // //                 ),
// // //                 this.orm.readGroup(
// // //                     "res.partner",
// // //                     [...customerDomain, ['customer_rank', '>', 0]],
// // //                     ['country_id'],
// // //                     ['country_id']
// // //                 )
// // //             ]);

// // //             this.stats.totalCallCenterLeads = totalCallCenterLeads;
// // //             this.stats.totalLeads = totalLeads;
// // //             this.stats.totalCustomers = totalCustomers;
// // //             this.stats.callCenterData = callCenterData;
// // //             this.stats.leadDataBySource = leadDataBySource;
// // //             this.stats.leadDataByStage = leadDataByStage;
// // //             this.stats.customerDataByCountry = customerDataByCountry;
// // //         } catch (error) {
// // //             console.error("Error fetching stats:", error);
// // //         }
// // //     }

// // //     renderCharts() {
// // //         this.destroyAllCharts();

// // //         // Call Center Charts
// // //         if (this.stats.callCenterData.length) {
// // //             const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
// // //             const data = this.stats.callCenterData.map(item => item.stage_id_count);
// // //             const backgroundColors = labels.map((_, index) => getColor(index));

// // //             // Bar Chart
// // //             this.barChart = new Chart(this.barChartRef.el, {
// // //                 type: "bar",
// // //                 data: {
// // //                     labels: labels,
// // //                     datasets: [{
// // //                         label: 'Call Center Leads by Stage',
// // //                         data: data,
// // //                         backgroundColor: backgroundColors,
// // //                         borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
// // //                         borderWidth: 1
// // //                     }]
// // //                 },
// // //                 options: {
// // //                     responsive: true,
// // //                     maintainAspectRatio: false,
// // //                     scales: {
// // //                         y: {
// // //                             beginAtZero: true
// // //                         }
// // //                     },
// // //                     animation: {
// // //                         duration: 0
// // //                     }
// // //                 }
// // //             });

// // //             // Pie Chart
// // //             this.pieChart = new Chart(this.pieChartRef.el, {
// // //                 type: "pie",
// // //                 data: {
// // //                     labels: labels,
// // //                     datasets: [{
// // //                         data: data,
// // //                         backgroundColor: backgroundColors,
// // //                         borderWidth: 1
// // //                     }]
// // //                 },
// // //                 options: {
// // //                     responsive: true,
// // //                     maintainAspectRatio: false,
// // //                     animation: {
// // //                         duration: 0
// // //                     }
// // //                 }
// // //             });
// // //         }

// // //         // All Leads Charts
// // //         if (this.stats.leadDataBySource.length) {
// // //             const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
// // //             const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
// // //             const sourceColors = sourceLabels.map((_, index) => getColor(index + 5));

// // //             this.sourceChart = new Chart(this.sourceChartRef.el, {
// // //                 type: "doughnut",
// // //                 data: {
// // //                     labels: sourceLabels,
// // //                     datasets: [{
// // //                         data: sourceData,
// // //                         backgroundColor: sourceColors,
// // //                         borderWidth: 1
// // //                     }]
// // //                 },
// // //                 options: {
// // //                     responsive: true,
// // //                     maintainAspectRatio: false,
// // //                     animation: {
// // //                         duration: 0
// // //                     }
// // //                 }
// // //             });
// // //         }

// // //         if (this.stats.leadDataByStage.length) {
// // //             const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
// // //             const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
// // //             const stageColors = stageLabels.map((_, index) => getColor(index + 10));

// // //             this.stageChart = new Chart(this.stageChartRef.el, {
// // //                 type: "bar",
// // //                 data: {
// // //                     labels: stageLabels,
// // //                     datasets: [{
// // //                         label: 'All Leads by Stage',
// // //                         data: stageData,
// // //                         backgroundColor: stageColors,
// // //                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
// // //                         borderWidth: 1
// // //                     }]
// // //                 },
// // //                 options: {
// // //                     responsive: true,
// // //                     maintainAspectRatio: false,
// // //                     scales: {
// // //                         y: {
// // //                             beginAtZero: true
// // //                         }
// // //                     },
// // //                     animation: {
// // //                         duration: 0
// // //                     }
// // //                 }
// // //             });
// // //         }

// // //         // Customer Charts
// // //         if (this.stats.customerDataByCountry.length) {
// // //             const countryLabels = this.stats.customerDataByCountry.map(item => 
// // //                 item.country_id ? item.country_id[1] : 'No Country'
// // //             );
// // //             const countryData = this.stats.customerDataByCountry.map(item => item.country_id_count);
// // //             const countryColors = countryLabels.map((_, index) => getColor(index + 15));

// // //             this.customerCountryChart = new Chart(this.customerCountryChartRef.el, {
// // //                 type: "pie",
// // //                 data: {
// // //                     labels: countryLabels,
// // //                     datasets: [{
// // //                         data: countryData,
// // //                         backgroundColor: countryColors,
// // //                         borderWidth: 1
// // //                     }]
// // //                 },
// // //                 options: {
// // //                     responsive: true,
// // //                     maintainAspectRatio: false,
// // //                     animation: {
// // //                         duration: 0
// // //                     }
// // //                 }
// // //             });
// // //         }
// // //     }

// // //     async applyDateFilter() {
// // //         await this.fetchStats();
// // //         this.renderCharts();
// // //     }

// // //     async resetDateFilter() {
// // //         this.dateFilters.startDate = this.getDefaultStartDate();
// // //         this.dateFilters.endDate = this.getDefaultEndDate();
// // //         await this.fetchStats();
// // //         this.renderCharts();
// // //     }

// // //     onSearchQueryChange(event) {
// // //         this.searchQuery.value = event.target.value;
// // //     }

// // //     goToCRMPage(filter) {
// // //         const domain = [];
        
// // //         if (filter === 'callcenter') {
// // //             domain.push(["source_id.name", "=", "6033"]);
// // //         }
        
// // //         if (this.dateFilters.startDate) {
// // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // //         }
// // //         if (this.dateFilters.endDate) {
// // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // //         }

// // //         this.action.doAction({
// // //             type: "ir.actions.act_window",
// // //             res_model: "crm.lead",
// // //             view_mode: "list",
// // //             views: [[false, "list"]],
// // //             target: "current",
// // //             domain: domain,
// // //         });
// // //     }

// // //     goToCustomerPage() {
// // //         const domain = [['customer_rank', '>', 0]];
        
// // //         if (this.dateFilters.startDate) {
// // //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// // //         }
// // //         if (this.dateFilters.endDate) {
// // //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// // //         }

// // //         this.action.doAction({
// // //             type: "ir.actions.act_window",
// // //             res_model: "res.partner",
// // //             view_mode: "list",
// // //             views: [[false, "list"]],
// // //             target: "current",
// // //             domain: domain,
// // //         });
// // //     }
// // // }

// // // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// // // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);


// // /** @odoo-module **/

// // import { registry } from "@web/core/registry";
// // import { useService } from "@web/core/utils/hooks";
// // import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// // import { loadJS } from "@web/core/assets";
// // import { getColor } from "@web/core/colors/colors";

// // const actionRegistry = registry.category("actions");

// // export class ChartjsSampleCRM extends Component {
// //     setup() {
// //         this.orm = useService('orm');
// //         this.action = useService("action");
        
// //         // State management
// //         this.searchQuery = useState({ value: "" });
// //         this.dateFilters = useState({
// //             startDate: this.getDefaultStartDate(),
// //             endDate: this.getDefaultEndDate()
// //         });
// //         this.stats = useState({
// //             totalCallCenterLeads: 0,
// //             totalLeads: 0,
// //             totalCustomers: 0,
// //             callCenterData: [],
// //             leadDataBySource: [],
// //             leadDataByStage: [],
// //             customerDataByCountry: []
// //         });

// //         // Chart references
// //         this.barChartRef = useRef("barChart");
// //         this.pieChartRef = useRef("pieChart");
// //         this.sourceChartRef = useRef("sourceChart");
// //         this.stageChartRef = useRef("stageChart");
// //         this.customerCountryChartRef = useRef("customerCountryChart");
// //         this.barChart = null;
// //         this.pieChart = null;
// //         this.sourceChart = null;
// //         this.stageChart = null;
// //         this.customerCountryChart = null;

// //         // Initial setup
// //         onWillStart(async () => {
// //             await loadJS(["/web/static/lib/Chart/Chart.js"]);
// //             await this.fetchStats();
// //         });

// //         onMounted(() => {
// //             this.renderCharts();
// //             this.setupChartResizeListeners();
// //         });

// //         onWillUnmount(() => {
// //             this.destroyAllCharts();
// //             window.removeEventListener('resize', this.handleResize);
// //         });

// //         // Method binding
// //         this.goToCRMPage = this.goToCRMPage.bind(this);
// //         this.goToCustomerPage = this.goToCustomerPage.bind(this);
// //         this.fetchStats = this.fetchStats.bind(this);
// //         this.renderCharts = this.renderCharts.bind(this);
// //         this.destroyAllCharts = this.destroyAllCharts.bind(this);
// //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// //         this.applyDateFilter = this.applyDateFilter.bind(this);
// //         this.resetDateFilter = this.resetDateFilter.bind(this);
// //         this.handleResize = this.handleResize.bind(this);
// //     }

// //     destroyAllCharts() {
// //         if (this.barChart) this.barChart.destroy();
// //         if (this.pieChart) this.pieChart.destroy();
// //         if (this.sourceChart) this.sourceChart.destroy();
// //         if (this.stageChart) this.stageChart.destroy();
// //         if (this.customerCountryChart) this.customerCountryChart.destroy();
// //     }

// //     setupChartResizeListeners() {
// //         window.addEventListener('resize', this.handleResize);
// //     }

// //     handleResize() {
// //         clearTimeout(this.resizeTimer);
// //         this.resizeTimer = setTimeout(() => {
// //             this.renderCharts();
// //         }, 200);
// //     }

// //     getDefaultStartDate() {
// //         const date = new Date();
// //         date.setMonth(date.getMonth() - 1);
// //         return date.toISOString().split('T')[0];
// //     }

// //     getDefaultEndDate() {
// //         return new Date().toISOString().split('T')[0];
// //     }

// //     async fetchStats() {
// //         try {
// //             // Get call center source ID
// //             const callCenterSource = await this.orm.search(
// //                 "utm.source", 
// //                 [['name', '=', '6033']], 
// //                 { limit: 1 }
// //             );
            
// //             // Build domains with date filters
// //             const leadDomain = [];
// //             const customerDomain = [];
// //             const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
            
// //             if (this.dateFilters.startDate) {
// //                 leadDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// //                 customerDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// //                 if (callCenterSource.length) {
// //                     callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
// //                 }
// //             }
// //             if (this.dateFilters.endDate) {
// //                 leadDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// //                 customerDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// //                 if (callCenterSource.length) {
// //                     callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// //                 }
// //             }
            
// //             // Get counts and data
// //             const [
// //                 totalCallCenterLeads, 
// //                 totalLeads, 
// //                 totalCustomers,
// //                 callCenterData, 
// //                 leadDataBySource, 
// //                 leadDataByStage,
// //                 customerDataByCountry
// //             ] = await Promise.all([
// //                 callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
// //                 this.orm.searchCount("crm.lead", leadDomain),
// //                 this.orm.searchCount("res.partner", [...customerDomain, ['customer_rank', '>', 0]]),
// //                 callCenterSource.length ? this.orm.readGroup(
// //                     "crm.lead",
// //                     callCenterDomain,
// //                     ['stage_id'],
// //                     ['stage_id']
// //                 ) : [],
// //                 this.orm.readGroup(
// //                     "crm.lead",
// //                     leadDomain,
// //                     ['source_id'],
// //                     ['source_id']
// //                 ),
// //                 this.orm.readGroup(
// //                     "crm.lead",
// //                     leadDomain,
// //                     ['stage_id'],
// //                     ['stage_id']
// //                 ),
// //                 this.orm.readGroup(
// //                     "res.partner",
// //                     [...customerDomain, ['customer_rank', '>', 0]],
// //                     ['country_id'],
// //                     ['country_id']
// //                 )
// //             ]);

// //             this.stats.totalCallCenterLeads = totalCallCenterLeads;
// //             this.stats.totalLeads = totalLeads;
// //             this.stats.totalCustomers = totalCustomers;
// //             this.stats.callCenterData = callCenterData;
// //             this.stats.leadDataBySource = leadDataBySource;
// //             this.stats.leadDataByStage = leadDataByStage;
// //             this.stats.customerDataByCountry = customerDataByCountry;
// //         } catch (error) {
// //             console.error("Error fetching stats:", error);
// //         }
// //     }

// //     renderCharts() {
// //         this.destroyAllCharts();

// //         // Call Center Charts
// //         if (this.stats.callCenterData.length) {
// //             const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
// //             const data = this.stats.callCenterData.map(item => item.stage_id_count);
// //             const backgroundColors = labels.map((_, index) => getColor(index));

// //             // Bar Chart
// //             this.barChart = new Chart(this.barChartRef.el, {
// //                 type: "bar",
// //                 data: {
// //                     labels: labels,
// //                     datasets: [{
// //                         label: 'Call Center Leads by Stage',
// //                         data: data,
// //                         backgroundColor: backgroundColors,
// //                         borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     scales: {
// //                         y: {
// //                             beginAtZero: true
// //                         }
// //                     },
// //                     animation: {
// //                         duration: 0
// //                     }
// //                 }
// //             });

// //             // Pie Chart
// //             this.pieChart = new Chart(this.pieChartRef.el, {
// //                 type: "pie",
// //                 data: {
// //                     labels: labels,
// //                     datasets: [{
// //                         data: data,
// //                         backgroundColor: backgroundColors,
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     animation: {
// //                         duration: 0
// //                     }
// //                 }
// //             });
// //         }

// //         // All Leads Charts
// //         if (this.stats.leadDataBySource.length) {
// //             const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
// //             const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
// //             const sourceColors = sourceLabels.map((_, index) => getColor(index + 5));

// //             this.sourceChart = new Chart(this.sourceChartRef.el, {
// //                 type: "doughnut",
// //                 data: {
// //                     labels: sourceLabels,
// //                     datasets: [{
// //                         data: sourceData,
// //                         backgroundColor: sourceColors,
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     animation: {
// //                         duration: 0
// //                     }
// //                 }
// //             });
// //         }

// //         if (this.stats.leadDataByStage.length) {
// //             const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
// //             const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
// //             const stageColors = stageLabels.map((_, index) => getColor(index + 10));

// //             this.stageChart = new Chart(this.stageChartRef.el, {
// //                 type: "bar",
// //                 data: {
// //                     labels: stageLabels,
// //                     datasets: [{
// //                         label: 'All Leads by Stage',
// //                         data: stageData,
// //                         backgroundColor: stageColors,
// //                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     scales: {
// //                         y: {
// //                             beginAtZero: true
// //                         }
// //                     },
// //                     animation: {
// //                         duration: 0
// //                     }
// //                 }
// //             });
// //         }

// //         // Customer Charts
// //         if (this.stats.customerDataByCountry.length) {
// //             const countryLabels = this.stats.customerDataByCountry.map(item => 
// //                 item.country_id ? item.country_id[1] : 'No Country'
// //             );
// //             const countryData = this.stats.customerDataByCountry.map(item => item.country_id_count);
// //             const countryColors = countryLabels.map((_, index) => getColor(index + 15));

// //             this.customerCountryChart = new Chart(this.customerCountryChartRef.el, {
// //                 type: "pie",
// //                 data: {
// //                     labels: countryLabels,
// //                     datasets: [{
// //                         data: countryData,
// //                         backgroundColor: countryColors,
// //                         borderWidth: 1
// //                     }]
// //                 },
// //                 options: {
// //                     responsive: true,
// //                     maintainAspectRatio: false,
// //                     animation: {
// //                         duration: 0
// //                     }
// //                 }
// //             });
// //         }
// //     }

// //     async applyDateFilter() {
// //         await this.fetchStats();
// //         this.renderCharts();
// //     }

// //     async resetDateFilter() {
// //         this.dateFilters.startDate = this.getDefaultStartDate();
// //         this.dateFilters.endDate = this.getDefaultEndDate();
// //         await this.fetchStats();
// //         this.renderCharts();
// //     }

// //     onSearchQueryChange(event) {
// //         this.searchQuery.value = event.target.value;
// //     }

// //     goToCRMPage(filter) {
// //         const domain = [];
        
// //         if (filter === 'callcenter') {
// //             domain.push(["source_id.name", "=", "6033"]);
// //         }
        
// //         if (this.dateFilters.startDate) {
// //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// //         }
// //         if (this.dateFilters.endDate) {
// //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// //         }

// //         this.action.doAction({
// //             type: "ir.actions.act_window",
// //             res_model: "crm.lead",
// //             view_mode: "list",
// //             views: [[false, "list"]],
// //             target: "current",
// //             domain: domain,
// //         });
// //     }

// //     goToCustomerPage() {
// //         const domain = [['customer_rank', '>', 0]];
        
// //         if (this.dateFilters.startDate) {
// //             domain.push(['create_date', '>=', this.dateFilters.startDate]);
// //         }
// //         if (this.dateFilters.endDate) {
// //             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
// //         }

// //         this.action.doAction({
// //             type: "ir.actions.act_window",
// //             res_model: "res.partner",
// //             view_mode: "list",
// //             views: [[false, "list"]],
// //             target: "current",
// //             domain: domain,
// //         });
// //     }
// // }

// // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);




// /** @odoo-module **/

// import { registry } from "@web/core/registry";
// import { useService } from "@web/core/utils/hooks";
// import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
// import { loadJS } from "@web/core/assets";
// import { getColor } from "@web/core/colors/colors";

// const actionRegistry = registry.category("actions");

// export class ChartjsSampleCRM extends Component {
//     setup() {
//         this.orm = useService('orm');
//         this.action = useService("action");
        
//         // State management
//         this.searchQuery = useState({ value: "" });
//         this.dateFilters = useState({
//             startDate: this.getDefaultStartDate(),
//             endDate: this.getDefaultEndDate()
//         });
//         this.stats = useState({
//             totalCallCenterLeads: 0,
//             totalLeads: 0,
//             totalCustomers: 0,
//             callCenterData: [],
//             leadDataBySource: [],
//             leadDataByStage: [],
//             customerDataByType: [],
//             customerDataByCountry: []
//         });

//         // Chart references
//         this.barChartRef = useRef("barChart");
//         this.pieChartRef = useRef("pieChart");
//         this.sourceChartRef = useRef("sourceChart");
//         this.stageChartRef = useRef("stageChart");
//         this.customerTypeChartRef = useRef("customerTypeChart");
//         this.customerCountryChartRef = useRef("customerCountryChart");
//         this.barChart = null;
//         this.pieChart = null;
//         this.sourceChart = null;
//         this.stageChart = null;
//         this.customerTypeChart = null;
//         this.customerCountryChart = null;

//         // Initial setup
//         onWillStart(async () => {
//             await loadJS(["/web/static/lib/Chart/Chart.js"]);
//             await this.fetchStats();
//         });

//         onMounted(() => {
//             this.renderCharts();
//             this.setupChartResizeListeners();
//         });

//         onWillUnmount(() => {
//             this.destroyAllCharts();
//             window.removeEventListener('resize', this.handleResize);
//         });

//         // Method binding
//         this.goToCRMPage = this.goToCRMPage.bind(this);
//         this.goToCustomerPage = this.goToCustomerPage.bind(this);
//         this.fetchStats = this.fetchStats.bind(this);
//         this.renderCharts = this.renderCharts.bind(this);
//         this.destroyAllCharts = this.destroyAllCharts.bind(this);
//         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
//         this.applyDateFilter = this.applyDateFilter.bind(this);
//         this.resetDateFilter = this.resetDateFilter.bind(this);
//         this.handleResize = this.handleResize.bind(this);
//     }

//     destroyAllCharts() {
//         if (this.barChart) this.barChart.destroy();
//         if (this.pieChart) this.pieChart.destroy();
//         if (this.sourceChart) this.sourceChart.destroy();
//         if (this.stageChart) this.stageChart.destroy();
//         if (this.customerTypeChart) this.customerTypeChart.destroy();
//         if (this.customerCountryChart) this.customerCountryChart.destroy();
//     }

//     setupChartResizeListeners() {
//         window.addEventListener('resize', this.handleResize);
//     }

//     handleResize() {
//         clearTimeout(this.resizeTimer);
//         this.resizeTimer = setTimeout(() => {
//             this.renderCharts();
//         }, 200);
//     }

//     getDefaultStartDate() {
//         const date = new Date();
//         date.setMonth(date.getMonth() - 1);
//         return date.toISOString().split('T')[0];
//     }

//     getDefaultEndDate() {
//         return new Date().toISOString().split('T')[0];
//     }

//     async fetchStats() {
//         try {
//             // Get call center source ID
//             const callCenterSource = await this.orm.search(
//                 "utm.source", 
//                 [['name', '=', '6033']], 
//                 { limit: 1 }
//             );
            
//             // Build domains with date filters
//             const leadDomain = [];
//             const customerDomain = [];
//             const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
            
//             if (this.dateFilters.startDate) {
//                 leadDomain.push(['create_date', '>=', this.dateFilters.startDate]);
//                 customerDomain.push(['create_date', '>=', this.dateFilters.startDate]);
//                 if (callCenterSource.length) {
//                     callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
//                 }
//             }
//             if (this.dateFilters.endDate) {
//                 leadDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
//                 customerDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
//                 if (callCenterSource.length) {
//                     callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
//                 }
//             }
            
//             // Get counts and data
//             const [
//                 totalCallCenterLeads, 
//                 totalLeads, 
//                 totalCustomers,
//                 callCenterData, 
//                 leadDataBySource, 
//                 leadDataByStage,
//                 customerDataByType,
//                 customerDataByCountry
//             ] = await Promise.all([
//                 callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
//                 this.orm.searchCount("crm.lead", leadDomain),
//                 this.orm.searchCount("res.partner", [...customerDomain, ['customer_rank', '>', 0]]),
//                 callCenterSource.length ? this.orm.readGroup(
//                     "crm.lead",
//                     callCenterDomain,
//                     ['stage_id'],
//                     ['stage_id']
//                 ) : [],
//                 this.orm.readGroup(
//                     "crm.lead",
//                     leadDomain,
//                     ['source_id'],
//                     ['source_id']
//                 ),
//                 this.orm.readGroup(
//                     "crm.lead",
//                     leadDomain,
//                     ['stage_id'],
//                     ['stage_id']
//                 ),
//                 this.orm.readGroup(
//                     "res.partner",
//                     [...customerDomain, ['customer_rank', '>', 0]],
//                     ['is_company'],
//                     ['is_company']
//                 ),
//                 this.orm.readGroup(
//                     "res.partner",
//                     [...customerDomain, ['customer_rank', '>', 0]],
//                     ['country_id'],
//                     ['country_id']
//                 )
//             ]);

//             this.stats.totalCallCenterLeads = totalCallCenterLeads;
//             this.stats.totalLeads = totalLeads;
//             this.stats.totalCustomers = totalCustomers;
//             this.stats.callCenterData = callCenterData;
//             this.stats.leadDataBySource = leadDataBySource;
//             this.stats.leadDataByStage = leadDataByStage;
//             this.stats.customerDataByType = customerDataByType;
//             this.stats.customerDataByCountry = customerDataByCountry;
//         } catch (error) {
//             console.error("Error fetching stats:", error);
//         }
//     }

//     renderCharts() {
//         this.destroyAllCharts();

//         // Call Center Charts
//         if (this.stats.callCenterData.length) {
//             const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
//             const data = this.stats.callCenterData.map(item => item.stage_id_count);
//             const backgroundColors = labels.map((_, index) => getColor(index));

//             // Bar Chart
//             this.barChart = new Chart(this.barChartRef.el, {
//                 type: "bar",
//                 data: {
//                     labels: labels,
//                     datasets: [{
//                         label: 'Call Center Leads by Stage',
//                         data: data,
//                         backgroundColor: backgroundColors,
//                         borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     scales: {
//                         y: {
//                             beginAtZero: true
//                         }
//                     },
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });

//             // Pie Chart
//             this.pieChart = new Chart(this.pieChartRef.el, {
//                 type: "pie",
//                 data: {
//                     labels: labels,
//                     datasets: [{
//                         data: data,
//                         backgroundColor: backgroundColors,
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });
//         }

//         // All Leads Charts
//         if (this.stats.leadDataBySource.length) {
//             const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
//             const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
//             const sourceColors = sourceLabels.map((_, index) => getColor(index + 5));

//             this.sourceChart = new Chart(this.sourceChartRef.el, {
//                 type: "doughnut",
//                 data: {
//                     labels: sourceLabels,
//                     datasets: [{
//                         data: sourceData,
//                         backgroundColor: sourceColors,
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });
//         }

//         if (this.stats.leadDataByStage.length) {
//             const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
//             const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
//             const stageColors = stageLabels.map((_, index) => getColor(index + 10));

//             this.stageChart = new Chart(this.stageChartRef.el, {
//                 type: "bar",
//                 data: {
//                     labels: stageLabels,
//                     datasets: [{
//                         label: 'All Leads by Stage',
//                         data: stageData,
//                         backgroundColor: stageColors,
//                         borderColor: stageColors.map(color => color.replace('0.6', '1')),
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     scales: {
//                         y: {
//                             beginAtZero: true
//                         }
//                     },
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });
//         }

//         // Customer Charts
//         if (this.stats.customerDataByType.length) {
//             const typeLabels = this.stats.customerDataByType.map(item => 
//                 item.is_company ? 'Company' : 'Individual'
//             );
//             const typeData = this.stats.customerDataByType.map(item => item.is_company_count);
//             const typeColors = ['#3b82f6', '#10b981'];

//             this.customerTypeChart = new Chart(this.customerTypeChartRef.el, {
//                 type: "pie",
//                 data: {
//                     labels: typeLabels,
//                     datasets: [{
//                         data: typeData,
//                         backgroundColor: typeColors,
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });
//         }

//         if (this.stats.customerDataByCountry.length) {
//             const countryLabels = this.stats.customerDataByCountry.map(item => 
//                 item.country_id ? item.country_id[1] : 'No Country'
//             );
//             const countryData = this.stats.customerDataByCountry.map(item => item.country_id_count);
//             const countryColors = countryLabels.map((_, index) => getColor(index + 15));

//             this.customerCountryChart = new Chart(this.customerCountryChartRef.el, {
//                 type: "pie",
//                 data: {
//                     labels: countryLabels,
//                     datasets: [{
//                         data: countryData,
//                         backgroundColor: countryColors,
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     animation: {
//                         duration: 0
//                     }
//                 }
//             });
//         }
//     }

//     async applyDateFilter() {
//         await this.fetchStats();
//         this.renderCharts();
//     }

//     async resetDateFilter() {
//         this.dateFilters.startDate = this.getDefaultStartDate();
//         this.dateFilters.endDate = this.getDefaultEndDate();
//         await this.fetchStats();
//         this.renderCharts();
//     }

//     onSearchQueryChange(event) {
//         this.searchQuery.value = event.target.value;
//     }

//     goToCRMPage(filter) {
//         const domain = [];
        
//         if (filter === 'callcenter') {
//             domain.push(["source_id.name", "=", "6033"]);
//         }
        
//         if (this.dateFilters.startDate) {
//             domain.push(['create_date', '>=', this.dateFilters.startDate]);
//         }
//         if (this.dateFilters.endDate) {
//             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
//         }

//         this.action.doAction({
//             type: "ir.actions.act_window",
//             res_model: "crm.lead",
//             view_mode: "list",
//             views: [[false, "list"]],
//             target: "current",
//             domain: domain,
//         });
//     }

//     goToCustomerPage() {
//         const domain = [['customer_rank', '>', 0]];
        
//         if (this.dateFilters.startDate) {
//             domain.push(['create_date', '>=', this.dateFilters.startDate]);
//         }
//         if (this.dateFilters.endDate) {
//             domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
//         }

//         this.action.doAction({
//             type: "ir.actions.act_window",
//             res_model: "res.partner",
//             view_mode: "list",
//             views: [[false, "list"]],
//             target: "current",
//             domain: domain,
//         });
//     }
// }

// ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
// actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);




/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, onWillStart, useRef, onMounted, onWillUnmount, useState } from "@odoo/owl";
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/core/colors/colors";

const actionRegistry = registry.category("actions");

export class ChartjsSampleCRM extends Component {
    setup() {
        this.orm = useService('orm');
        this.action = useService("action");
        
        // State management
        this.searchQuery = useState({ value: "" });
        this.dateFilters = useState({
            startDate: this.getDefaultStartDate(),
            endDate: this.getDefaultEndDate()
        });
        this.stats = useState({
            totalCallCenterLeads: 0,
            totalReceptionLeads: 0,
            totalLeads: 0,
            totalCustomers: 0,
            callCenterData: [],
            receptionData: [],
            leadDataBySource: [],
            leadDataByStage: [],
            customerDataByType: [],
            customerDataByCountry: []
        });

        // Chart references
        this.barChartRef = useRef("barChart");
        this.pieChartRef = useRef("pieChart");
        this.receptionChartRef = useRef("receptionChart");
        this.sourceChartRef = useRef("sourceChart");
        this.stageChartRef = useRef("stageChart");
        this.customerTypeChartRef = useRef("customerTypeChart");
        this.customerCountryChartRef = useRef("customerCountryChart");
        this.barChart = null;
        this.pieChart = null;
        this.receptionChart = null;
        this.sourceChart = null;
        this.stageChart = null;
        this.customerTypeChart = null;
        this.customerCountryChart = null;

        // Initial setup
        onWillStart(async () => {
            await loadJS(["/web/static/lib/Chart/Chart.js"]);
            await this.fetchStats();
        });

        onMounted(() => {
            this.renderCharts();
            this.setupChartResizeListeners();
        });

        onWillUnmount(() => {
            this.destroyAllCharts();
            window.removeEventListener('resize', this.handleResize);
        });

        // Method binding
        this.goToCRMPage = this.goToCRMPage.bind(this);
        this.goToCustomerPage = this.goToCustomerPage.bind(this);
        this.goToReceptionPage = this.goToReceptionPage.bind(this);
        this.fetchStats = this.fetchStats.bind(this);
        this.renderCharts = this.renderCharts.bind(this);
        this.destroyAllCharts = this.destroyAllCharts.bind(this);
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.applyDateFilter = this.applyDateFilter.bind(this);
        this.resetDateFilter = this.resetDateFilter.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    destroyAllCharts() {
        if (this.barChart) this.barChart.destroy();
        if (this.pieChart) this.pieChart.destroy();
        if (this.receptionChart) this.receptionChart.destroy();
        if (this.sourceChart) this.sourceChart.destroy();
        if (this.stageChart) this.stageChart.destroy();
        if (this.customerTypeChart) this.customerTypeChart.destroy();
        if (this.customerCountryChart) this.customerCountryChart.destroy();
    }

    setupChartResizeListeners() {
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.renderCharts();
        }, 200);
    }

    getDefaultStartDate() {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    }

    getDefaultEndDate() {
        return new Date().toISOString().split('T')[0];
    }

    async fetchStats() {
        try {
            // Get call center and reception source IDs
            const [callCenterSource, receptionSource] = await Promise.all([
                this.orm.search("utm.source", [['name', '=', '6033']], { limit: 1 }),
                this.orm.search("utm.source", [['name', '=', 'Walk In']], { limit: 1 })
            ]);
            
            // Build domains with date filters
            const leadDomain = [];
            const customerDomain = [];
            const callCenterDomain = callCenterSource.length ? [['source_id', '=', callCenterSource[0]]] : [];
            const receptionDomain = receptionSource.length ? [['source_id', '=', receptionSource[0]]] : [];
            
            if (this.dateFilters.startDate) {
                leadDomain.push(['create_date', '>=', this.dateFilters.startDate]);
                customerDomain.push(['create_date', '>=', this.dateFilters.startDate]);
                if (callCenterSource.length) {
                    callCenterDomain.push(['create_date', '>=', this.dateFilters.startDate]);
                }
                if (receptionSource.length) {
                    receptionDomain.push(['create_date', '>=', this.dateFilters.startDate]);
                }
            }
            if (this.dateFilters.endDate) {
                leadDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
                customerDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
                if (callCenterSource.length) {
                    callCenterDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
                }
                if (receptionSource.length) {
                    receptionDomain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
                }
            }
            
            // Get counts and data
            const [
                totalCallCenterLeads, 
                totalReceptionLeads,
                totalLeads, 
                totalCustomers,
                callCenterData, 
                receptionData,
                leadDataBySource, 
                leadDataByStage,
                customerDataByType,
                customerDataByCountry
            ] = await Promise.all([
                callCenterSource.length ? this.orm.searchCount("crm.lead", callCenterDomain) : 0,
                receptionSource.length ? this.orm.searchCount("crm.lead", receptionDomain) : 0,
                this.orm.searchCount("crm.lead", leadDomain),
                this.orm.searchCount("res.partner", [...customerDomain, ['customer_rank', '>', 0]]),
                callCenterSource.length ? this.orm.readGroup(
                    "crm.lead",
                    callCenterDomain,
                    ['stage_id'],
                    ['stage_id']
                ) : [],
                receptionSource.length ? this.orm.readGroup(
                    "crm.reception",
                    receptionDomain,
                    ['state'],
                    ['state']
                ) : [],
                this.orm.readGroup(
                    "crm.lead",
                    leadDomain,
                    ['source_id'],
                    ['source_id']
                ),
                this.orm.readGroup(
                    "crm.lead",
                    leadDomain,
                    ['stage_id'],
                    ['stage_id']
                ),
                this.orm.readGroup(
                    "res.partner",
                    [...customerDomain, ['customer_rank', '>', 0]],
                    ['is_company'],
                    ['is_company']
                ),
                this.orm.readGroup(
                    "res.partner",
                    [...customerDomain, ['customer_rank', '>', 0]],
                    ['country_id'],
                    ['country_id']
                )
            ]);

            this.stats.totalCallCenterLeads = totalCallCenterLeads;
            this.stats.totalReceptionLeads = totalReceptionLeads;
            this.stats.totalLeads = totalLeads;
            this.stats.totalCustomers = totalCustomers;
            this.stats.callCenterData = callCenterData;
            this.stats.receptionData = receptionData;
            this.stats.leadDataBySource = leadDataBySource;
            this.stats.leadDataByStage = leadDataByStage;
            this.stats.customerDataByType = customerDataByType;
            this.stats.customerDataByCountry = customerDataByCountry;
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    renderCharts() {
        this.destroyAllCharts();

        // Call Center Charts
        if (this.stats.callCenterData.length) {
            const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
            const data = this.stats.callCenterData.map(item => item.stage_id_count);
            const backgroundColors = labels.map((_, index) => getColor(index));

            // Bar Chart
            this.barChart = new Chart(this.barChartRef.el, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Call Center Leads by Stage',
                        data: data,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    animation: {
                        duration: 0
                    }
                }
            });

            // Pie Chart
            this.pieChart = new Chart(this.pieChartRef.el, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0
                    }
                }
            });
        }

        // Reception Chart
        if (this.stats.receptionData.length) {
            const labels = this.stats.receptionData.map(item => item.state ? item.state.toUpperCase() : 'UNKNOWN');
            const data = this.stats.receptionData.map(item => item.state_count);
            const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56']; // Different colors for reception

            this.receptionChart = new Chart(this.receptionChartRef.el, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0
                    }
                }
            });
        }

        // All Leads Charts
        if (this.stats.leadDataBySource.length) {
            const sourceLabels = this.stats.leadDataBySource.map(item => item.source_id ? item.source_id[1] : 'Undefined');
            const sourceData = this.stats.leadDataBySource.map(item => item.source_id_count);
            const sourceColors = sourceLabels.map((_, index) => getColor(index + 5));

            this.sourceChart = new Chart(this.sourceChartRef.el, {
                type: "doughnut",
                data: {
                    labels: sourceLabels,
                    datasets: [{
                        data: sourceData,
                        backgroundColor: sourceColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0
                    }
                }
            });
        }

        if (this.stats.leadDataByStage.length) {
            const stageLabels = this.stats.leadDataByStage.map(item => item.stage_id[1]);
            const stageData = this.stats.leadDataByStage.map(item => item.stage_id_count);
            const stageColors = stageLabels.map((_, index) => getColor(index + 10));

            this.stageChart = new Chart(this.stageChartRef.el, {
                type: "bar",
                data: {
                    labels: stageLabels,
                    datasets: [{
                        label: 'All Leads by Stage',
                        data: stageData,
                        backgroundColor: stageColors,
                        borderColor: stageColors.map(color => color.replace('0.6', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    animation: {
                        duration: 0
                    }
                }
            });
        }

        // Customer Charts
        if (this.stats.customerDataByType.length) {
            const typeLabels = this.stats.customerDataByType.map(item => 
                item.is_company ? 'Company' : 'Individual'
            );
            const typeData = this.stats.customerDataByType.map(item => item.is_company_count);
            const typeColors = ['#3b82f6', '#10b981'];

            this.customerTypeChart = new Chart(this.customerTypeChartRef.el, {
                type: "pie",
                data: {
                    labels: typeLabels,
                    datasets: [{
                        data: typeData,
                        backgroundColor: typeColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0
                    }
                }
            });
        }

        if (this.stats.customerDataByCountry.length) {
            const countryLabels = this.stats.customerDataByCountry.map(item => 
                item.country_id ? item.country_id[1] : 'No Country'
            );
            const countryData = this.stats.customerDataByCountry.map(item => item.country_id_count);
            const countryColors = countryLabels.map((_, index) => getColor(index + 15));

            this.customerCountryChart = new Chart(this.customerCountryChartRef.el, {
                type: "pie",
                data: {
                    labels: countryLabels,
                    datasets: [{
                        data: countryData,
                        backgroundColor: countryColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 0
                    }
                }
            });
        }
    }

    async applyDateFilter() {
        await this.fetchStats();
        this.renderCharts();
    }

    async resetDateFilter() {
        this.dateFilters.startDate = this.getDefaultStartDate();
        this.dateFilters.endDate = this.getDefaultEndDate();
        await this.fetchStats();
        this.renderCharts();
    }

    onSearchQueryChange(event) {
        this.searchQuery.value = event.target.value;
    }

    goToCRMPage(filter) {
        const domain = [];
        
        if (filter === 'callcenter') {
            domain.push(["source_id.name", "=", "6033"]);
        } else if (filter === 'reception') {
            domain.push(["source_id.name", "=", "Walk In"]);
        }
        
        if (this.dateFilters.startDate) {
            domain.push(['create_date', '>=', this.dateFilters.startDate]);
        }
        if (this.dateFilters.endDate) {
            domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
        }

        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "crm.lead",
            view_mode: "list",
            views: [[false, "list"]],
            target: "current",
            domain: domain,
        });
    }

    goToReceptionPage() {
        const domain = [];
        
        if (this.dateFilters.startDate) {
            domain.push(['create_date', '>=', this.dateFilters.startDate]);
        }
        if (this.dateFilters.endDate) {
            domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
        }

        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "crm.reception",
            view_mode: "list",
            views: [[false, "list"]],
            target: "current",
            domain: domain,
        });
    }

    goToCustomerPage() {
        const domain = [['customer_rank', '>', 0]];
        
        if (this.dateFilters.startDate) {
            domain.push(['create_date', '>=', this.dateFilters.startDate]);
        }
        if (this.dateFilters.endDate) {
            domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
        }

        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "res.partner",
            view_mode: "list",
            views: [[false, "list"]],
            target: "current",
            domain: domain,
        });
    }
}

ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);