"use client";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, isLocationMatch, translate } from "@/lib/utils";
import Link from "next/link";
import LinkButton from "./link-or-button";
import MultiNestedMenus from "./multi-nested";
import { api } from "@/config/axios.config";

const NestedMenus = ({
  nestedIndex,
  index,
  nestedMenus,
  locationName,
  toggleMulti,
  multiIndex,
  trans,
}) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [totalReports, setTotalReports] = useState([]);

  const getTotalReports = async () => {
    try {
      const { data } = await api.get("/admin/tickets/count", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const results = Object.keys(data.data).map((key) => data.data[key]);

      setTotalReports(results);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTotalReports();
    return () => {};
  }, []);

  return (
    <Collapsible open={nestedIndex === index}>
      <CollapsibleContent className="CollapsibleContent">
        <ul className="sub-menu space-y-3 relative before:absolute before:left-4 before:top-0  before:h-[calc(100%-5px)]  before:w-[2px] before:bg-primary/10 dark:before:bg-primary/20 before:rounded">
          {nestedMenus?.map((item, j) => (
            <li
              className={cn(
                "block ml-[30px]  relative first:pt-4  before:absolute first:before:top-4 before: top-0 before:-left-[14px]  before:w-[2px]  before:h-0 before:transition-all before:duration-200 ",
                {
                  "before:bg-primary first:before:h-[calc(100%-16px)]  before:h-full":
                    isLocationMatch(item.href, locationName),
                  "last:pb-1": nestedIndex === index,
                }
              )}
              key={`sub_menu_${j}`}
            >
              <LinkButton
                toggleMulti={toggleMulti}
                item={item}
                index={j}
                multiIndex={multiIndex}
                locationName={locationName}
                trans={trans}
                totalReport={totalReports[j]}
              >
                <div className={cn("pl-3  text-sm capitalize  font-normal ")}>
                  {translate(item.title, trans)}
                </div>
              </LinkButton>
              <MultiNestedMenus
                menus={item?.child}
                multiIndex={multiIndex}
                index={j}
                locationName={locationName}
                trans={trans}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NestedMenus;
