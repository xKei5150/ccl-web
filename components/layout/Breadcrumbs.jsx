"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    ...segments.map((segment, index) => {
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return {
        name,
        href: `/${segments.slice(0, index + 1).join("/")}`,
      };
    }),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
