"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import apiClient, { AxiosError } from "@/lib/apiClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(addFriendValidator) });

  const { mutate: addFriend, isPending } = useMutation({
    mutationFn: (email: string) =>
      apiClient.post("/api/friends/add", { email }),
    onSuccess: () => {
      setShowSuccessState(true);
      reset();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? ((error.response?.data as string) ?? "Something went wrong.")
          : "Something went wrong.";
      setError("email", { message });
    },
  });

  const onSubmit = ({ email }: FormData) => {
    setShowSuccessState(false);
    addFriend(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-mediumleading-6 text-gray-900"
      >
        Add Friend by Email
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border border-transparent pl-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
             focus:outline-none focus:border-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button isLoading={isPending}>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      )}
    </form>
  );
};

export default AddFriendButton;
