export const menuitems = [
  {
    title: "Administration",
    to: "main/administrations",
    icon:"/icons/admin.png",
    submenu: [
      {
        title: "Master Setup",
        to: "administrations/master",
        submenu: [
          { title: "Item", to: "administrations/master/item" },
          { title: "Supplier", to: "administrations/master/supplier" },
          { title: "User", to: "administrations/master/user" },
          { title: "Approval Layer", to: "administrations/master/applayer" },
        ],
      },
      {
        title: "Codes & Parameters",
        to: "administrations/codes",
        
        submenu: [
          { title: "Process Name", to: "administrations/codes/processname" },
          { title: "Store", to: "administrations/codes/store" },
          { title: "Store Type", to: "administrations/codes/storetype" },
          { title: "Department", to: "administrations/codes/department" },
          { title: "Designation", to: "administrations/codes/designation" },
          { title: "Section", to: "administrations/codes/section" },
          { title: "Salutation", to: "administrations/codes/salutation" },
          { title: "Marital Status", to: "administrations/codes/maritalstatus" },
          { title: "Religion", to: "administrations/codes/religion" },
          { title: "Blood Group", to: "administrations/codes/bloodgroup" },
          { title: "Gender", to: "administrations/codes/gender" },
          { title: "Relation", to: "administrations/codes/relation" },
          { title: "Job Location", to: "administrations/codes/joblocation" },
          { title: "Job Title", to: "administrations/codes/jobtitle" },
          { title: "Employee Type", to: "administrations/codes/emptype" },
          { title: "Product Group", to: "administrations/codes/itemgroup" },
          { title: "Product Category", to: "administrations/codes/itemcat" },
          { title: "Payment Type", to: "administrations/codes/paymenttype" },
        ],
      },
    ],
  },
  {
    title: "Employee Info",
    to: "main/hr",
    icon:"/icons/employee.png",
    submenu: [
      { title: "Employee Information", to: "hr/personalinfo" },
    ],
  },
  {
    title: "E Prescription",
    to: "main/eprescription",
    icon:"/icons/prescription.png",
    submenu: [
      {
        title: "E Prescription",
        to: "eprescription/prescription",
      },
    ],
  },
  {
    title: "Inventory",
    to: "main/inventory",
    icon:"/icons/warehouse.png",
    submenu: [
      {
        title: "GRN Transaction",
        to: "inventory/grn",
        submenu: [
          { title: "Product Receive", to: "inventory/Receive/Product-Receive" },
          { title: "Current Product Stock", to: "inventory/grn/currentstock" },
          { title: "Current Product Stock Batch", to: "inventory/grn/batchstock" },
          { title: "Product Receive Approval", to: "inventory/grnapproval/pogrnapp" },
        ],
      },
      {
        title: "Transfer Transaction",
        to: "/inventory/transfer",
        submenu: [
          { title: "Store Requisition", to: "inventory/transfer/imtorheader" },
          { title: "Store Requisition Approval", to: "inventory/transfer/imtorheaderapp" },
          { title: "Issue From Store", to: "inventory/transfer/imtormoreqheader" },
          { title: "Receive From Store", to: "inventory/transfer/imtransfersr" },
          { title: "Product Damage", to: "inventory/transfer/imtorheaderdam" },
          { title: "Product Damage Approval", to: "inventory/transfer/imtorheaderdamapp" },
        ],
      },
    ],
  },
  {
    title: "Pharmacy",
    to: "main/pharmacy",
    icon:"/icons/pharmacy.png",
    submenu: [
      { title: "Pharmacy Dispense", to: "pharmacy/mmpharmacy" },
    ],
  },
];
