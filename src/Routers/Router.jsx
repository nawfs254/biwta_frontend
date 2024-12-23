import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/Login/Login";
import ErrorPage from "../ErrorPage";
import PrivateRoutes from "../PrivateRoutes";

// Pages for Administration - Master Setup
import Item from "../Pages/Item/Item";
import Supplier from "../Pages/Suppliers/supplier";
import User from "../Pages/UserEntry/User";

// Pages for Administration - Codes & Parameters
import Store from "../Pages/Xcodes/Store";
import StoreType from "../Pages/Xcodes/StoreType";
import Department from "../Pages/Xcodes/Department";
import Designation from "../Pages/Xcodes/Designation";
import Section from "../Pages/Xcodes/Section";
import Salutation from "../Pages/Xcodes/Salutation";
import MaritalStatus from "../Pages/Xcodes/MaritalStatus";
import Religion from "../Pages/Xcodes/Religion";
import BloodGroup from "../Pages/Xcodes/BloodGroup";
import Gender from "../Pages/Xcodes/Gender";
import Relation from "../Pages/Xcodes/Relation";
import JobLocation from "../Pages/Xcodes/JobLocation";
import JobTitle from "../Pages/Xcodes/JobTitle";
import EmpType from "../Pages/Xcodes/EmpType";
import ItemGroup from "../Pages/ItemGroup/ItemGroup";
import PaymentType from "../Pages/Xcodes/PaymentType";

// Pages for Employee Info
import Pdmsthrd from "../Pages/Personalinfo/Pdmsthrd";
import Pogrndirect from "../Pages/Inventory/grn/Pogrndirect";
import Batchstock from "../Pages/Inventory/grn/batchstock";
import Currentstock from "../Pages/Inventory/grn/currentstock";
import Imtorheader from "../Pages/Inventory/Transfer/Imtorheader";

import Imtormoreqheader from "../Pages/Inventory/Transfer/Imtormoreqheader";
import Imtransfersr from "../Pages/Inventory/Transfer/Imtransfersr";
import Mmpharmacy from "../Pages/Pharmacy/Mmpharmacy";
import Eprescription from "../Pages/Prescription/Eprescription";
import ProcessName from "../Pages/Xcodes/ProcessName";
import Imtorheaderdam from "../Pages/Inventory/Transfer/Imtorheaderdam";
import ApprovalLayer from "../Pages/ApprovalLayer/ApprovalLayer";
import Pogrnapp from "../Pages/Inventory/grnapproval/Pogrnapp";
import ItemCategory from "../Pages/Xcodes/ItemCategory";
import Imtorheaderapp from "../Pages/Inventory/Transfer/Imtorheaderapp";
import Imtorheaderdamapp from "../Pages/Inventory/Transfer/Imtorheaderdamapp";






const Router = createBrowserRouter([
  // Default Route (Login)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/main",
    element: <PrivateRoutes element={<Main />} />,
    children: [
      {
        path: "administrations",
        children: [
          {
            path: "master",
            children: [
              { path: "item", element: <Item /> },
              { path: "supplier", element: <Supplier /> },
              { path: "user", element: <User /> },
              { path: "applayer", element: <ApprovalLayer /> },
              
            ],
          },
          {
            path: "codes",
            children: [
              { path: "processname", element: <ProcessName /> },
              { path: "store", element: <Store /> },
              { path: "storetype", element: <StoreType /> },
              { path: "department", element: <Department /> },
              { path: "designation", element: <Designation /> },
              { path: "section", element: <Section /> },
              { path: "salutation", element: <Salutation /> },
              { path: "maritalstatus", element: <MaritalStatus /> },
              { path: "religion", element: <Religion /> },
              { path: "bloodgroup", element: <BloodGroup /> },
              { path: "gender", element: <Gender /> },
              { path: "relation", element: <Relation /> },
              { path: "joblocation", element: <JobLocation /> },
              { path: "jobtitle", element: <JobTitle /> },
              { path: "emptype", element: <EmpType /> },
              { path: "itemgroup", element: <ItemGroup /> },
              { path: "itemcat", element: <ItemCategory /> },
              { path: "paymenttype", element: <PaymentType /> },
            ],
          },
        ],
      },
      {
        path: "pharmacy",
        children: [
            { path: "mmpharmacy", element: <Mmpharmacy /> }
        ],
      },
      {
        path: "eprescription",
        children: [
            { path: "prescription", element: <Eprescription /> }
        ],
      },
      {
        path: "hr",
        children: [
            { path: "personalinfo", element: <Pdmsthrd /> }
        ],
      },
      {
        path: "inventory",
        children: [
            { path: "Receive/Product-Receive", element: <Pogrndirect/> },
            { path: "grn/currentstock", element: <Currentstock/> },
            { path: "grn/batchstock", element: <Batchstock/> },
            { path: "grnapproval/pogrnapp", element: <Pogrnapp/> },
            { path: "transfer/imtorheader", element: <Imtorheader/> },
            { path: "transfer/imtorheaderapp", element: <Imtorheaderapp/> },
            { path: "transfer/imtormoreqheader", element: <Imtormoreqheader/> },
            { path: "transfer/imtransfersr", element: <Imtransfersr/> },
            { path: "transfer/imtorheaderdam", element: <Imtorheaderdam/> },
            { path: "transfer/imtorheaderdamapp", element: <Imtorheaderdamapp/> }
        ],
      },
     
    ],
  },
  // Catch-all for unmatched routes
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default Router;
