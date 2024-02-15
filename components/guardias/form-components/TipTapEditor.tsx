import React, { ReactNode, useEffect } from "react";
import {
  EditorContent,
  EditorProvider,
  FloatingMenu,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Ordered from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";

type TipTapEditorProps = {
  setTasks: any;
};

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          (editor.isActive("bulletList") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          (editor.isActive("itemList") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Ordered List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={
          (editor.isActive("bold") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={
          (editor.isActive("italic") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          (editor.isActive("strike") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Strike
      </button>
    </>
  );
};
const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc",
    },
  }),
  Ordered.configure({
    HTMLAttributes: {
      class: "list-decimal",
    },
  }),
  Placeholder.configure({
    placeholder: "Empiece a escribir...",
    emptyEditorClass: "is-editor-empty",
  }),
];
const TipTapEditor = (props: { children: ReactNode }) => {

  return (
    <div className="h-full w-full">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        editorProps={{
          attributes: {
            class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none border-[1px] border-black rounded-md h-full p-3",
          },
        }}>
          {props.children}
        </EditorProvider>
    </div>
  );
};

export default TipTapEditor;
