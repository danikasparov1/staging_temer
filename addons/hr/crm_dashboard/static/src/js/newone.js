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
// // // //         this.data = useState([]);
// // // //         this.filterType = useState({ value: "all" });
// // // //         this.searchQuery = useState({ value: "" });
// // // //         this.stats = useState({
// // // //             totalLeads: 0,
// // // //             totalOpportunities: 0,
// // // //             totalWon: 0,
// // // //             totalLost: 0,
// // // //         });
// // // //         this.canvasRef = useRef("canvas");
// // // //         this.canvasReftwo = useRef("canvastwo");
// // // //         this.canvasRefthree = useRef("canvasthree");

// // // //         onWillStart(async () => await loadJS(["/web/static/lib/Chart/Chart.js"]));

// // // //         onMounted(() => {
// // // //             this.fetchData();
// // // //             this.fetchStats();
// // // //         });

// // // //         onWillUnmount(() => {
// // // //             if (this.chart) {
// // // //                 this.chart.destroy();
// // // //             }
// // // //             if (this.charttwo) {
// // // //                 this.charttwo.destroy();
// // // //             }
// // // //             if (this.chartthree) {
// // // //                 this.chartthree.destroy();
// // // //             }
// // // //         });

// // // //         // Bind methods to ensure correct `this` context
// // // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // // //         this.fetchData = this.fetchData.bind(this);
// // // //         this.fetchStats = this.fetchStats.bind(this);
// // // //         this.renderChart = this.renderChart.bind(this);
// // // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // // //     }

// // // //     async fetchData() {
// // // //         const domain = [];
        
// // // //         if (this.filterType.value && this.filterType.value !== "all") {
// // // //             domain.push(['type', '=', this.filterType.value]);
// // // //         }
// // // //         if (this.searchQuery.value) {
// // // //             domain.push(['name', 'ilike', this.searchQuery.value]);
// // // //         }
    
// // // //         const leads = await this.orm.searchRead("crm.lead", domain, ["id", "name", "stage_id", "probability"]);
// // // //         console.log('Fetched leads:', leads);

// // // //         this.data = leads;
// // // //         this.renderChart();
// // // //     }

// // // //     async fetchStats() {
// // // //         const totalLeads = await this.orm.searchRead("crm.lead", [], ["id"]);
// // // //         const totalOpportunities = await this.orm.searchRead("crm.lead", [['type', '=', 'opportunity']], ["id"]);
// // // //         const totalWon = await this.orm.searchRead("crm.lead", [['stage_id', '=', 'won']], ["id"]);
// // // //         const totalLost = await this.orm.searchRead("crm.lead", [['stage_id', '=', 'lost']], ["id"]);

// // // //         this.stats.totalLeads = totalLeads.length;
// // // //         this.stats.totalOpportunities = totalOpportunities.length;
// // // //         this.stats.totalWon = totalWon.length;
// // // //         this.stats.totalLost = totalLost.length;
// // // //     }

// // // //     renderChart() {
// // // //         const labels = this.data.map(item => item.name || "Unknown Lead");
// // // //         const data = this.data.map(item => item.probability || 0);
// // // //         const color = labels.map((_, index) => getColor(index));
    
// // // //         if (this.chart) this.chart.destroy();
// // // //         if (this.charttwo) this.charttwo.destroy();
// // // //         if (this.chartthree) this.chartthree.destroy();
    
// // // //         this.chart = new Chart(this.canvasRef.el, {
// // // //             type: "bar",
// // // //             data: {
// // // //                 labels: labels,
// // // //                 datasets: [
// // // //                     {
// // // //                         label: 'Lead Probability',
// // // //                         data: data,
// // // //                         backgroundColor: color,
// // // //                     },
// // // //                 ],
// // // //             },
// // // //         });
    
// // // //         this.charttwo = new Chart(this.canvasReftwo.el, {
// // // //             type: "line",
// // // //             data: {
// // // //                 labels: labels,
// // // //                 datasets: [
// // // //                     {
// // // //                         label: 'Lead Probability',
// // // //                         data: data,
// // // //                         backgroundColor: color,
// // // //                         borderColor: color,
// // // //                         fill: false,
// // // //                     },
// // // //                 ],
// // // //             },
// // // //         });

// // // //         this.chartthree = new Chart(this.canvasRefthree.el, {
// // // //             type: "pie",
// // // //             data: {
// // // //                 labels: labels,
// // // //                 datasets: [
// // // //                     {
// // // //                         label: 'Lead Probability',
// // // //                         data: data,
// // // //                         backgroundColor: color,
// // // //                     },
// // // //                 ],
// // // //             },
// // // //         });
// // // //     }

// // // //     onSearchQueryChange(event) {
// // // //         this.searchQuery.value = event.target.value;
// // // //         this.fetchData();
// // // //     }

// // // //     goToCRMPage(filter) {
// // // //         const domain = [];

// // // //         if (filter === "leads") {
// // // //             domain.push(["type", "=", "lead"]);
// // // //         } else if (filter === "opportunities") {
// // // //             domain.push(["type", "=", "opportunity"]);
// // // //         } else if (filter === "won") {
// // // //             domain.push(["stage_id", "=", "won"]);
// // // //         } else if (filter === "lost") {
// // // //             domain.push(["stage_id", "=", "lost"]);
// // // //         }

// // // //         if (this.action) {
// // // //             this.action.doAction({
// // // //                 type: "ir.actions.act_window",
// // // //                 res_model: "crm.lead",
// // // //                 view_mode: "list",
// // // //                 views: [[false, "list"]],
// // // //                 target: "current",
// // // //                 domain: domain,
// // // //             });
// // // //         } else {
// // // //             console.error("Action service is not available.");
// // // //         }
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
// // //         this.data = useState([]);
// // //         this.filterType = useState({ value: "all" });
// // //         this.searchQuery = useState({ value: "" });
// // //         this.stats = useState({
// // //             totalLeads: 0,
// // //             totalCallCenterLeads: 0,  // New stat for call center leads
// // //             totalOpportunities: 0,
// // //             totalWon: 0,
// // //             totalLost: 0,
// // //         });
// // //         this.canvasRef = useRef("canvas");
// // //         this.canvasReftwo = useRef("canvastwo");
// // //         this.canvasRefthree = useRef("canvasthree");

// // //         onWillStart(async () => await loadJS(["/web/static/lib/Chart/Chart.js"]));

// // //         onMounted(() => {
// // //             this.fetchData();
// // //             this.fetchStats();
// // //         });

// // //         onWillUnmount(() => {
// // //             if (this.chart) {
// // //                 this.chart.destroy();
// // //             }
// // //             if (this.charttwo) {
// // //                 this.charttwo.destroy();
// // //             }
// // //             if (this.chartthree) {
// // //                 this.chartthree.destroy();
// // //             }
// // //         });

// // //         // Bind methods
// // //         this.goToCRMPage = this.goToCRMPage.bind(this);
// // //         this.fetchData = this.fetchData.bind(this);
// // //         this.fetchStats = this.fetchStats.bind(this);
// // //         this.renderChart = this.renderChart.bind(this);
// // //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// // //     }

// // //     async fetchData() {
// // //         const domain = [];
        
// // //         if (this.filterType.value && this.filterType.value !== "all") {
// // //             domain.push(['type', '=', this.filterType.value]);
// // //         }
// // //         if (this.searchQuery.value) {
// // //             domain.push(['name', 'ilike', this.searchQuery.value]);
// // //         }
    
// // //         const leads = await this.orm.searchRead(
// // //             "crm.lead", 
// // //             domain, 
// // //             ["id", "name", "stage_id", "probability", "source_id"]
// // //         );
// // //         console.log('Fetched leads:', leads);

// // //         this.data = leads;
// // //         this.renderChart();
// // //     }

// // //     async fetchStats() {
// // //         // Get all standard stats
// // //         const totalLeads = await this.orm.searchCount("crm.lead", []);
// // //         const totalOpportunities = await this.orm.searchCount("crm.lead", [['type', '=', 'opportunity']]);
// // //         const totalWon = await this.orm.searchCount("crm.lead", [['stage_id', '=', 'won']]);
// // //         const totalLost = await this.orm.searchCount("crm.lead", [['stage_id', '=', 'lost']]);
        
// // //         // Get call center specific leads (source = 6033)
// // //         const callCenterSource = await this.orm.search(
// // //             "utm.source", 
// // //             [['name', '=', '6033']], 
// // //             { limit: 1 }
// // //         );
        
// // //         let totalCallCenterLeads = 0;
// // //         if (callCenterSource.length > 0) {
// // //             totalCallCenterLeads = await this.orm.searchCount(
// // //                 "crm.lead", 
// // //                 [['source_id', '=', callCenterSource[0]]]
// // //             );
// // //         }

// // //         this.stats.totalLeads = totalLeads;
// // //         this.stats.totalCallCenterLeads = totalCallCenterLeads;
// // //         this.stats.totalOpportunities = totalOpportunities;
// // //         this.stats.totalWon = totalWon;
// // //         this.stats.totalLost = totalLost;
// // //     }

// // //     renderChart() {
// // //         const labels = this.data.map(item => item.name || "Unknown Lead");
// // //         const data = this.data.map(item => item.probability || 0);
// // //         const color = labels.map((_, index) => getColor(index));
    
// // //         if (this.chart) this.chart.destroy();
// // //         if (this.charttwo) this.charttwo.destroy();
// // //         if (this.chartthree) this.chartthree.destroy();
    
// // //         this.chart = new Chart(this.canvasRef.el, {
// // //             type: "bar",
// // //             data: {
// // //                 labels: labels,
// // //                 datasets: [
// // //                     {
// // //                         label: 'Lead Probability',
// // //                         data: data,
// // //                         backgroundColor: color,
// // //                     },
// // //                 ],
// // //             },
// // //         });
    
// // //         this.charttwo = new Chart(this.canvasReftwo.el, {
// // //             type: "line",
// // //             data: {
// // //                 labels: labels,
// // //                 datasets: [
// // //                     {
// // //                         label: 'Lead Probability',
// // //                         data: data,
// // //                         backgroundColor: color,
// // //                         borderColor: color,
// // //                         fill: false,
// // //                     },
// // //                 ],
// // //             },
// // //         });

// // //         this.chartthree = new Chart(this.canvasRefthree.el, {
// // //             type: "pie",
// // //             data: {
// // //                 labels: labels,
// // //                 datasets: [
// // //                     {
// // //                         label: 'Lead Probability',
// // //                         data: data,
// // //                         backgroundColor: color,
// // //                     },
// // //                 ],
// // //             },
// // //         });
// // //     }

// // //     onSearchQueryChange(event) {
// // //         this.searchQuery.value = event.target.value;
// // //         this.fetchData();
// // //     }

// // //     goToCRMPage(filter) {
// // //         const domain = [];

// // //         if (filter === "leads") {
// // //             domain.push(["type", "=", "lead"]);
// // //         } else if (filter === "opportunities") {
// // //             domain.push(["type", "=", "opportunity"]);
// // //         } else if (filter === "won") {
// // //             domain.push(["stage_id", "=", "won"]);
// // //         } else if (filter === "lost") {
// // //             domain.push(["stage_id", "=", "lost"]);
// // //         } else if (filter === "callcenter") {
// // //             // Add domain for call center leads (source = 6033)
// // //             domain.push(["source_id.name", "=", "6033"]);
// // //         }

// // //         if (this.action) {
// // //             this.action.doAction({
// // //                 type: "ir.actions.act_window",
// // //                 res_model: "crm.lead",
// // //                 view_mode: "list",
// // //                 views: [[false, "list"]],
// // //                 target: "current",
// // //                 domain: domain,
// // //             });
// // //         } else {
// // //             console.error("Action service is not available.");
// // //         }
// // //     }
// // // }

// // // ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";

// // // actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);


// // /** @odoo-module **/

// // import { registry } from "@web/core/registry";
// // import { useService } from "@web/core/utils/hooks";
// // import { Component, onWillStart, useState } from "@odoo/owl";

// // const actionRegistry = registry.category("actions");

// // export class ChartjsSampleCRM extends Component {
// //     setup() {
// //         this.orm = useService('orm');
// //         this.action = useService("action");
// //         this.searchQuery = useState({ value: "" });
// //         this.stats = useState({
// //             totalCallCenterLeads: 0,  // Only keep call center stat
// //         });

// //         onWillStart(async () => {
// //             await this.fetchStats();
// //         });

// //         this.goToCRMPage = this.goToCRMPage.bind(this);
// //         this.fetchStats = this.fetchStats.bind(this);
// //         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
// //     }

// //     async fetchStats() {
// //         // Get call center specific leads (source = 6033)
// //         const callCenterSource = await this.orm.search(
// //             "utm.source", 
// //             [['name', '=', '6033']], 
// //             { limit: 1 }
// //         );
        
// //         let totalCallCenterLeads = 0;
// //         if (callCenterSource.length > 0) {
// //             totalCallCenterLeads = await this.orm.searchCount(
// //                 "crm.lead", 
// //                 [['source_id', '=', callCenterSource[0]]]
// //             );
// //         }

// //         this.stats.totalCallCenterLeads = totalCallCenterLeads;
// //     }

// //     onSearchQueryChange(event) {
// //         this.searchQuery.value = event.target.value;
// //     }

// //     goToCRMPage(filter) {
// //         const domain = [];
// //         if (filter === "callcenter") {
// //             domain.push(["source_id.name", "=", "6033"]);
// //         }

// //         if (this.action) {
// //             this.action.doAction({
// //                 type: "ir.actions.act_window",
// //                 res_model: "crm.lead",
// //                 view_mode: "list",
// //                 views: [[false, "list"]],
// //                 target: "current",
// //                 domain: domain,
// //             });
// //         }
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
//         this.searchQuery = useState({ value: "" });
//         this.stats = useState({
//             totalCallCenterLeads: 0,
//             callCenterData: [] // For chart data
//         });

//         this.barChartRef = useRef("barChart");
//         this.pieChartRef = useRef("pieChart");
//         this.barChart = null;
//         this.pieChart = null;

//         onWillStart(async () => {
//             await loadJS(["/web/static/lib/Chart/Chart.js"]);
//             await this.fetchStats();
//         });

//         onMounted(() => {
//             this.renderCharts();
//         });

//         onWillUnmount(() => {
//             if (this.barChart) this.barChart.destroy();
//             if (this.pieChart) this.pieChart.destroy();
//         });

//         this.goToCRMPage = this.goToCRMPage.bind(this);
//         this.fetchStats = this.fetchStats.bind(this);
//         this.renderCharts = this.renderCharts.bind(this);
//         this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
//     }

//     async fetchStats() {
//         // Get call center specific leads (source = 6033)
//         const callCenterSource = await this.orm.search(
//             "utm.source", 
//             [['name', '=', '6033']], 
//             { limit: 1 }
//         );
        
//         let totalCallCenterLeads = 0;
//         let callCenterData = [];
        
//         if (callCenterSource.length > 0) {
//             totalCallCenterLeads = await this.orm.searchCount(
//                 "crm.lead", 
//                 [['source_id', '=', callCenterSource[0]]]
//             );
            
//             // Get data for charts - group by stage
//             callCenterData = await this.orm.readGroup(
//                 "crm.lead",
//                 [['source_id', '=', callCenterSource[0]]],
//                 ['stage_id'],
//                 ['stage_id']
//             );
//         }

//         this.stats.totalCallCenterLeads = totalCallCenterLeads;
//         this.stats.callCenterData = callCenterData;
//     }

//     renderCharts() {
//         if (!this.stats.callCenterData.length) return;

//         const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
//         const data = this.stats.callCenterData.map(item => item.stage_id_count);
//         const backgroundColors = labels.map((_, index) => getColor(index));

//         // Destroy existing charts if they exist
//         if (this.barChart) this.barChart.destroy();
//         if (this.pieChart) this.pieChart.destroy();

//         // Bar Chart
//         this.barChart = new Chart(this.barChartRef.el, {
//             type: "bar",
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Leads by Stage',
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });

//         // Pie Chart
//         this.pieChart = new Chart(this.pieChartRef.el, {
//             type: "pie",
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data,
//                     backgroundColor: backgroundColors,
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     }

//     onSearchQueryChange(event) {
//         this.searchQuery.value = event.target.value;
//     }

//     goToCRMPage(filter) {
//         const domain = [];
//         if (filter === "callcenter") {
//             domain.push(["source_id.name", "=", "6033"]);
//         }

//         if (this.action) {
//             this.action.doAction({
//                 type: "ir.actions.act_window",
//                 res_model: "crm.lead",
//                 view_mode: "list",
//                 views: [[false, "list"]],
//                 target: "current",
//                 domain: domain,
//             });
//         }
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
            callCenterData: []
        });

        // Chart references
        this.barChartRef = useRef("barChart");
        this.pieChartRef = useRef("pieChart");
        this.barChart = null;
        this.pieChart = null;

        // Initial setup
        onWillStart(async () => {
            await loadJS(["/web/static/lib/Chart/Chart.js"]);
            await this.fetchStats();
        });

        onMounted(() => {
            this.renderCharts();
        });

        onWillUnmount(() => {
            if (this.barChart) this.barChart.destroy();
            if (this.pieChart) this.pieChart.destroy();
        });

        // Method binding
        this.goToCRMPage = this.goToCRMPage.bind(this);
        this.fetchStats = this.fetchStats.bind(this);
        this.renderCharts = this.renderCharts.bind(this);
        this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
        this.applyDateFilter = this.applyDateFilter.bind(this);
        this.resetDateFilter = this.resetDateFilter.bind(this);
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
        // Get call center source ID
        const callCenterSource = await this.orm.search(
            "utm.source", 
            [['name', '=', '6033']], 
            { limit: 1 }
        );
        
        if (callCenterSource.length === 0) return;
        
        // Build domain with date filters
        const domain = [['source_id', '=', callCenterSource[0]]];
        
        if (this.dateFilters.startDate) {
            domain.push(['create_date', '>=', this.dateFilters.startDate]);
        }
        if (this.dateFilters.endDate) {
            domain.push(['create_date', '<=', this.dateFilters.endDate + ' 23:59:59']);
        }
        
        // Get counts and data
        const [totalCallCenterLeads, callCenterData] = await Promise.all([
            this.orm.searchCount("crm.lead", domain),
            this.orm.readGroup(
                "crm.lead",
                domain,
                ['stage_id'],
                ['stage_id']
            )
        ]);

        this.stats.totalCallCenterLeads = totalCallCenterLeads;
        this.stats.callCenterData = callCenterData;
    }

    renderCharts() {
        if (!this.stats.callCenterData.length) return;

        const labels = this.stats.callCenterData.map(item => item.stage_id[1]);
        const data = this.stats.callCenterData.map(item => item.stage_id_count);
        const backgroundColors = labels.map((_, index) => getColor(index));

        // Destroy existing charts
        if (this.barChart) this.barChart.destroy();
        if (this.pieChart) this.pieChart.destroy();

        // Bar Chart
        this.barChart = new Chart(this.barChartRef.el, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads by Stage',
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
                maintainAspectRatio: false
            }
        });
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
        const domain = [["source_id.name", "=", "6033"]];
        
        // Apply date filters to the action as well
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
}

ChartjsSampleCRM.template = "crm_dashboard.chartjs_sample_crm";
actionRegistry.add("chartjs_sample_crm", ChartjsSampleCRM);