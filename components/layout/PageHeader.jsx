import React from "react";
import { memo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbItemMemo = memo(({ crumb, isLast }) => (
  <BreadcrumbItem>
    {isLast ? (
      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
    ) : (
      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
    )}
  </BreadcrumbItem>
));

BreadcrumbItemMemo.displayName = "BreadcrumbItemMemo";

export const PageHeader = memo(({ title, breadcrumbs }) => {
  return (
    <div className="space-y-4 mb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          {/* {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItemMemo
              key={`${crumb.href}-${index}`}
              crumb={crumb}
              isLast={index === breadcrumbs.length - 1}
            />
          ))} */}
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.href}-${index}`}>
              <BreadcrumbItemMemo crumb={crumb} isLast={index === breadcrumbs.length - 1} />
              {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
    </div>
  );
});

PageHeader.displayName = "PageHeader";