import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Typography, Link as MUILink } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  // Get the current pathname
  const pathname = location.pathname;

  // Split the pathname into segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Construct breadcrumb links
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "~" + pathSegments.slice(0, index + 1).join("/");

    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize
      // href,
    };
  });

  return (
    <div className="pl-4">
      <MUIBreadcrumbs aria-label="breadcrumb">
        <MUILink  to="" underline="hover" color="inherit">
          ~
        </MUILink>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            <Typography key={breadcrumb.href} color="text.primary">
              {breadcrumb.label}
            </Typography>
          ) : (
            <MUILink
              key={breadcrumb.href}
              // component={Link}
              to=""
              underline="hover"
              color="inherit"
            >
              {breadcrumb.label}
            </MUILink>
          );
        })}
      </MUIBreadcrumbs>
    </div>
  );
}
