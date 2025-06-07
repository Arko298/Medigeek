"use client";
import NewPostForm from "@/components/newPostForm";
import PostFeed from "@/components/postFeed";
import RootLayout from "@/layouts/RootLayout";
import store from "@/store";
import React, { useState } from "react";
import { Provider } from "react-redux";

/* The Home page component */
export default function Home() {
  return (
    <Provider store={store}>
      <RootLayout>
        <div>
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <NewPostForm />
            <PostFeed />
          </div>
        </div>
      </RootLayout>
    </Provider>
  );
}
