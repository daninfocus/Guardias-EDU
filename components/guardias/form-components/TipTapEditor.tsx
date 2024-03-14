import React, { ReactNode, useEffect, useMemo } from "react";
import {
  Editor,
  EditorContent,
  EditorProvider,
  FloatingMenu,
  JSONContent,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Ordered from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { generateHTML } from "@tiptap/html";

type MenuBarProps = {
  editor: Editor | null;
};

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
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
        Lista con viñetas
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          (editor.isActive("orderedList") ? "bg-black text-white " : "") +
          "border-[1px] border-gray-300 rounded-md px-2 m-1"
        }
      >
        Lista Ordenada
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
        Negrita
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
        Itálica
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
        Tachado
      </button>
    </>
  );
};

interface TipTapProps {
  setState: React.Dispatch<React.SetStateAction<JSONContent>>;
  content: JSONContent | undefined;
}

const TipTapEditor: React.FC<TipTapProps> = ({ setState, content }) => {
  const html = useMemo(() => {
    if (content) {
      return generateHTML(content, [
        StarterKit,
        BulletList,
        Ordered,
        Placeholder,
      ]);
    }
  }, [content]);

  const editor = useEditor({
    content: html,
    editable: content !== undefined ? false : true,
    enableInputRules: content !== undefined ? false : true,
    onUpdate({ editor }) {
      setState(editor.getJSON());
    },
    extensions: [
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
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none rounded-md h-full min-w-max max-h-72 p-3",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return undefined;
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full w-full">
      {!content && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className={`${!content ?  'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none border-[1px] border-black rounded-md h-full max-h-72 p-3 overflow-hidden' : 'overflow-hidden'} `}
      />
    </div>
  );
};

export default TipTapEditor;
