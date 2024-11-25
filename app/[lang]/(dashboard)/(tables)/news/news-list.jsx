"use client";
import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import card1 from "@/public/images/card/dummy-photo.jpeg";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewsSheet from "./news-sheet";

export function NewsList() {
  const [sorting, setSorting] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [detailNews, setDetailNews] = React.useState({});
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [isOpenSheet, setIsOpenSheet] = React.useState(false);

  const getListNews = async () => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news`,
        {
          params: {
            type: "news",
          },
        }
      );

      setRows(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  React.useEffect(() => {
    getListNews();
  }, []);

  const getDetailNews = async (newsId) => {
    try {
      const { data } = await axios.get(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/${newsId}`
      );

      setDetailNews(data.data);
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  const handleDialogTriggerClick = (event, newsId) => {
    getDetailNews(newsId);
    // setIsDialogOpen(true);
  };

  const addEWSModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    setDetailNews({});
    setIsOpenSheet(true);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const updateNewsModal = async (ewsId) => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    await getDetailNews(ewsId);
    setIsOpenSheet(true);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const closeModal = () => {
    // setSelectedProject(null);
    // setSelectedProjectId(null);
    setIsOpenSheet(false);
    // wait().then(() => (document.body.style.pointerEvents = "auto"));
  };

  const deleteNews = async (newsId) => {
    try {
      await axios.delete(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/${newsId}`
      );

      getListNews();
    } catch (err) {
      toast.error(err.response.message || "Something Went Wrong");
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="text-2xl font-medium text-default-800">News</div>
        <Button onClick={addEWSModal} className="whitespace-nowrap">
          <Plus className="w-4 h-4  ltr:mr-2 rtl:ml-2 " />
          Add News
        </Button>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {rows.length !== 0 ? (
          rows.map((row) => {
            return (
              <Dialog key={row.id}>
                <Card className="">
                  <CardContent className="p-0">
                    <div className="w-full h-[191px] bg-muted-foreground overflow-hidden rounded-t-md">
                      <DialogTrigger
                        asChild
                        onClick={(event) =>
                          handleDialogTriggerClick(event, row.id)
                        }
                      >
                        <Image
                          className="w-full h-full object-cover cursor-pointer"
                          src={row.img}
                          alt="image"
                          width={500}
                          height={500}
                        />
                      </DialogTrigger>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col gap-y-3">
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">Title</p>
                          <p className="text-sm capitalize">{row.title}</p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                          <p className="text-muted-foreground text-sm">
                            Description
                          </p>
                          <p className="text-sm capitalize">
                            {row.desc
                              ? row?.desc?.length > 100
                                ? `${row.desc.substring(0, 100)}...`
                                : row.desc
                              : "-"}
                          </p>
                        </div>

                        <div className="flex gap-x-3 mt-2">
                          {/* <Link
                            className="flex-1 block"
                            href={`https://www.google.com/maps/search/?api=1&query=${row.lat}%2C${row.lng}`}
                            target="_blank"
                          > */}
                          <Button
                            className="w-full exclude-element"
                            variant="outline"
                            onClick={() => updateNewsModal(row.id)}
                          >
                            Update
                          </Button>
                          {/* </Link> */}
                          <Button
                            className="flex-1 exclude-element"
                            onClick={() => deleteNews(row.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <DialogContent size="4xl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-medium ">
                      Detail News
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex gap-x-12 mt-2 text-sm text-default-500 space-y-4">
                    <Image
                      className="w-56 object-cover"
                      src={detailNews.img}
                      alt="image"
                      width={500}
                      height={500}
                    />
                    <div className="flex flex-col gap-y-3">
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">Title</p>
                        <p className="text-sm text-default-900 capitalize">
                          {detailNews.title}
                        </p>
                      </div>
                      <div className="flex flex-col gap-y-2">
                        <p className="text-muted-foreground text-sm">
                          Description
                        </p>
                        <p className="text-sm text-default-900 capitalize">
                          {detailNews.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-8 gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" color="warning">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            );
          })
        ) : (
          <div className=" font-medium text-default-500">
            I'm Sorry, News Not Found
          </div>
        )}
      </div>

      <NewsSheet
        open={isOpenSheet}
        onClose={closeModal}
        getListNews={getListNews}
        detailNews={detailNews}
        // project={selectedNews}
        // selectedId={selectedProjectId}
      />
    </>
  );
}

export default NewsList;
