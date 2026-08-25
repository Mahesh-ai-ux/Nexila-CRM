import { all_routes } from "../../routes/all_routes";

const route = all_routes;

export const SidebarData = [

  // =====================================================
  // MAIN MENU
  // =====================================================

  {
    tittle: "Main Menu",
    icon: "airplay",
    showAsTab: true,
    separateRoute: false,

    submenuItems: [

      {
        label: "Applications",
        link: route.chat,

        submenu: true,
        showSubRoute: false,

        icon: "brand-airtable",

        base: "applications",

        materialicons: "start",
        dot: true,

        submenuItems: [
          {
            label: "Enquire Form",
            link: route.kanbanview,

            submenu: false,
            showSubRoute: false,

            base: "enquiry-form",
          },
        ],
      },

    ],
  },


  // =====================================================
  // CRM
  // =====================================================

  {
    tittle: "CRM",
    icon: "airplay",
    showAsTab: true,
    separateRoute: false,

    submenuItems: [

      // =================================================
      // DEMOS
      // =================================================

      {
        label: "Demos",
        link: route.dealsGrid,

        relatedRoutes: [
          route.dealsGrid,
          route.dealsList,
          route.dealsDetails,
        ],

        submenu: false,
        showSubRoute: false,

        icon: "medal",

        base: "crm-demos",

        materialicons: "start",
        dot: true,

        submenuItems: [],
      },


      // =================================================
      // LEADS
      // =================================================

      {
        label: "Leads",
        link: route.leads,

        relatedRoutes: [
          route.leads,
          route.leadsList,
          route.leadsDetails,
        ],

        submenu: false,
        showSubRoute: false,

        icon: "chart-arcs",

        base: "crm-leads",

        materialicons: "start",
        dot: true,

        submenuItems: [],
      },


      // =================================================
      // CRM STUDENTS
      // =================================================

      {
        label: "Students",

        // IMPORTANT:
        // Do NOT use "#"
        link: route.projectsGrid,

        submenu: true,
        showSubRoute: false,

        icon: "atom-2",

        // UNIQUE CRM BASE
        base: "crm-students",

        materialicons: "start",
        dot: true,

        submenuItems: [

          // ---------------------------------------------
          // STUDENTS MASTER
          // ---------------------------------------------

          {
            label: "Students Master",

            link: route.projectsGrid,

            submenu: false,
            showSubRoute: false,

            base: "crm-students-master",
          },


          // ---------------------------------------------
          // PENDING FEE STUDENTS
          // ---------------------------------------------

          {
            label: "Pending Fee Students",

            link: route.pendingFeeStudents,

            submenu: false,
            showSubRoute: false,

            base: "crm-pending-fee",
          },

        ],
      },

    ],
  },


  // =====================================================
  // HACKATHON
  // =====================================================

  {
    tittle: "Hackathon",

    icon: "airplay",

    showAsTab: true,

    separateRoute: false,

    submenuItems: [

      // =================================================
      // HACKATHON STUDENTS
      // =================================================

      {
        label: "HackathanStudents",

        link: route.hackathonList,

        relatedRoutes: [
          route.hackathonList,
          route.hackathonDetails,
          route.hackathonForm,
        ],

        submenu: false,

        showSubRoute: false,

        icon: "users",

        // UNIQUE HACKATHON BASE
        base: "hackathon-students",

        materialicons: "start",

        dot: true,

        submenuItems: [],
      },

    ],
  },

];