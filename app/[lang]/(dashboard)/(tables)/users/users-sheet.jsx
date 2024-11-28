"use client";
import React, { useState, useEffect, useTransition } from "react";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { addProjectAction, editProjectAction } from "@/action/project-action";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

const UsersSheet = ({ open, getListNews, detailNews, onClose, selectedId }) => {
  const [priority, setPriority] = React.useState(null);
  const [assign, setAssign] = React.useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const ResetForm = async () => {
    reset();
  };

  const updateNews = async (payloads) => {
    try {
      await axios.put(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/${detailNews.id}`,
        payloads
      );
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  const updateNewsImage = async (payloads) => {
    try {
      await axios.put(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news/update-image/${detailNews.id}`,
        payloads
      );
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  const createEWS = async (payloads) => {
    try {
      await axios.post(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/news`,
        payloads
      );
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  const onSubmit = (data) => {
    const updatedNews = {
      title: data.title,
      description: data.description,
      lat: "-",
      lng: "-",
    };

    const addedNews = {
      title: data.title,
      description: data.description,
      img: file.path,
      type: "news",
      lat: "-",
      lng: "-",
    };

    if (Object.keys(detailNews).length !== 0) {
      startTransition(async () => {
        await updateNews(updatedNews);
        await updateNewsImage({ img: file.path || detailNews.img });
        toast.success("Successfully Update");
        getListNews();
      });
    } else {
      startTransition(async () => {
        await createEWS(addedNews);
        toast.success("Successfully Added");
        getListNews();
      });
    }

    setFile(null);
    onClose();
    reset();
  };

  useEffect(() => {
    setFile(detailNews?.img ? { preview: detailNews?.img } : null);
    setValue("title", detailNews?.title || "");
    setValue("description", detailNews?.desc || "");
  }, [open]);

  const uploadMedia = async (file) => {
    try {
      const formData = new FormData();
      formData.append("folder", "RAKSHA");
      formData.append("media", file);

      const { data } = await axios.post(
        `https://api-rakhsa.inovatiftujuh8.com/api/v1/media`,
        formData
      );

      return data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = async (e) => {
    const accFile = e.target.files[0];
    const uploadedFile = await uploadMedia(accFile);
    setFile({
      ...uploadedFile,
      preview: URL.createObjectURL(accFile),
    });
  };

  return (
    <>
      <Sheet open={open}>
        <SheetContent
          onClose={() => {
            ResetForm();
            onClose();
          }}
          className="px-6"
        >
          <SheetHeader className="px-0">
            <SheetTitle>
              {Object.keys(detailNews).length !== 0 ? "Edit " : "Create"} News
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-40px)]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4  mt-6">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="thumbnail" className="mb-1.5">
                    Thumbnail
                  </Label>

                  {file ? (
                    <div className="flex flex-col items-center">
                      <Image
                        className="w-full h-full object-cover"
                        src={file.preview}
                        alt="image"
                        width={500}
                        height={500}
                      />
                      <Button
                        className="text-red-600"
                        type="button"
                        color="transparent"
                        onClick={() => setFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Controller
                      name="file"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Label
                            htmlFor="thumbnail"
                            className="h-12 w-12 flex justify-center items-center bg-default-100 rounded"
                          >
                            <Plus className="w-6 h-6 text-default-400" />
                          </Label>
                          <Input
                            type="file"
                            id="thumbnail"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </>
                      )}
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="title" className="mb-1.5">
                    Title
                  </Label>
                  <Input
                    type="text"
                    {...register("title")}
                    placeholder="Title"
                  />
                </div>
                {errors.title && (
                  <div className=" text-destructive mt-2">
                    {errors.title.message}
                  </div>
                )}
                <div>
                  <Label htmlFor="description" className="mb-1.5">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Description"
                    {...register("description")}
                  />
                </div>
                {errors.description && (
                  <div className=" text-destructive mt-2">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="mt-12 flex gap-6">
                <Button
                  type="button"
                  color="warning"
                  variant="soft"
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    setFile(null);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending} className="flex-1">
                  {Object.keys(detailNews).length !== 0
                    ? "Update"
                    : "  Create  "}{" "}
                  News
                </Button>
              </div>
            </form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UsersSheet;
