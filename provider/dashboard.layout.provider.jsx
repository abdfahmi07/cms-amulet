"use client";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReports, useSidebar, useThemeStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Footer from "@/components/partials/footer";
import { useMediaQuery } from "@/hooks/use-media-query";
import ThemeCustomize from "@/components/partials/customizer/theme-customizer";
import MobileSidebar from "@/components/partials/sidebar/mobile-sidebar";
import HeaderSearch from "@/components/header-search";
import { useMounted } from "@/hooks/use-mounted";
import LayoutLoader from "@/components/layout-loader";
import { getSocket } from "../config/socket-io";
import { getAddress } from "@/utils/maps";
import { api } from "@/config/axios.config";

const DashBoardLayoutProvider = ({ children, trans }) => {
  const { collapsed, sidebarType, setCollapsed, subMenu } = useSidebar();
  const { reports, setReports } = useReports();
  const [open, setOpen] = useState(false);
  const { layout } = useThemeStore();
  const location = usePathname();
  const isMobile = useMediaQuery("(min-width: 768px)");
  const mounted = useMounted();
  const socket = getSocket();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("init:guard:listenLiveTickets");
    });
  }, []);

  useEffect(() => {
    socket.on("listen:openCase", async (newData) => {
      // console.log(data);
      // const formattedAddress = await getAddress({
      //   lat: data.latitude,
      //   lng: data.longitude,
      // });
      // const formattedData = { ...data, address: formattedAddress };

      // setReports([formattedData, ...reports]);
      const { data } = await api.get("/ticket/admin", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const responsesData = data.data;
      const filteredData = responsesData.filter(
        (responseData) => responseData.id !== newData.id
      );

      const foundedData = responsesData.find(
        (responseData) => responseData.id === newData.id
      );
      const formattedData = { ...foundedData, isNew: true };

      // console.log(data);
      setReports([formattedData, ...filteredData]);
    });
  }, []);

  useEffect(() => {
    socket.on("listen:removeOpenCase", (data) => {
      // const filteredData = reports.filter((report) => report.id !== data.id);
      // setReports(filteredData);
      // console.log(data);
    });
  }, [reports]);

  // useEffect(() => {
  //   socket.emit("init:guard:listenLiveTickets");
  // }, []);

  if (!mounted) {
    return <LayoutLoader />;
  }
  if (layout === "semibox") {
    return (
      <>
        <Header handleOpenSearch={() => setOpen(true)} trans={trans} />
        <Sidebar trans={trans} />

        <div
          className={cn("content-wrapper transition-all duration-150 ", {
            "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
            "ltr:xl:ml-[272px] rtl:xl:mr-[272px]": !collapsed,
          })}
        >
          <div
            className={cn(
              "md:pt-6 pb-[37px] pt-[15px] md:px-6 px-4  page-min-height-semibox ",
              {}
            )}
          >
            <div className="semibox-content-wrapper ">
              <LayoutWrapper
                isMobile={isMobile}
                setOpen={setOpen}
                open={open}
                location={location}
              >
                {children}
              </LayoutWrapper>
            </div>
          </div>
        </div>
        <Footer trans={trans} />
        <ThemeCustomize trans={trans} />
      </>
    );
  }
  if (layout === "horizontal") {
    return (
      <>
        <Header handleOpenSearch={() => setOpen(true)} trans={trans} />

        <div className={cn("content-wrapper transition-all duration-150 ")}>
          <div
            className={cn(
              "  md:pt-6 pb-[37px] pt-[15px] md:px-6 px-4  page-min-height-horizontal ",
              {}
            )}
          >
            <LayoutWrapper
              isMobile={isMobile}
              setOpen={setOpen}
              open={open}
              location={location}
            >
              {children}
            </LayoutWrapper>
          </div>
        </div>
        <Footer />
        <ThemeCustomize />
      </>
    );
  }

  if (sidebarType !== "module") {
    return (
      <>
        <Header handleOpenSearch={() => setOpen(true)} trans={trans} />
        <Sidebar trans={trans} />

        <div
          className={cn("content-wrapper transition-all duration-150 ", {
            "ltr:xl:ml-[248px] rtl:xl:mr-[248px] ": !collapsed,
            "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
          })}
        >
          <div
            className={cn(
              "md:pt-6 pb-[37px] pt-[15px] md:px-6 px-4 page-min-height",
              {}
            )}
          >
            <LayoutWrapper
              isMobile={isMobile}
              setOpen={setOpen}
              open={open}
              location={location}
            >
              {children}
            </LayoutWrapper>
          </div>
        </div>
        <Footer trans={trans} />
        <ThemeCustomize trans={trans} />
      </>
    );
  }
  return (
    <>
      <Header handleOpenSearch={() => setOpen(true)} trans={trans} />
      <Sidebar trans={trans} />

      <div
        className={cn("content-wrapper transition-all duration-150 ", {
          "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
          "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        })}
      >
        <div
          className={cn(
            "  md:pt-6 layout-padding pt-[15px] md:px-6 px-4  page-min-height ",
            {}
          )}
        >
          <LayoutWrapper
            isMobile={isMobile}
            setOpen={setOpen}
            open={open}
            location={location}
          >
            {children}
          </LayoutWrapper>
        </div>
      </div>
      <Footer handleOpenSearch={() => setOpen(true)} trans={trans} />
      {isMobile && <ThemeCustomize />}
    </>
  );
};

export default DashBoardLayoutProvider;

const LayoutWrapper = ({ children, isMobile, setOpen, open, location }) => {
  return (
    <>
      <motion.div
        key={location}
        initial="pageInitial"
        animate="pageAnimate"
        exit="pageExit"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
          },
          pageExit: {
            opacity: 0,
            y: -50,
          },
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5,
        }}
      >
        <main>{children}</main>
      </motion.div>

      <MobileSidebar className="left-[300px]" />
      <HeaderSearch open={open} setOpen={setOpen} />
    </>
  );
};
