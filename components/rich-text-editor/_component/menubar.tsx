import { TooltipProvider } from "@/components/ui/tooltip";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import {
    AlignCenter,
    AlignLeft, AlignRight,
    Bold,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Italic,
    ListIcon,
    ListOrderedIcon, Redo,
    Strikethrough, Undo
} from "lucide-react";
import FormatGroup from "@/components/rich-text-editor/_component/format-group";

export default function MenuBar( { editor }: { editor: Editor | null } ) {
    if ( !editor ) {
        return null;
    }

    const data = {
        formatContent: [
            {
                name: "Bold",
                pressed: editor.isActive("bold"),
                onPressedChange: () => editor.chain().focus().toggleBold().run(),
                className: cn(editor.isActive("bold") && "bg-muted text-muted-foreground"),
                icon: <Bold/>,
            },
            {
                name: "Italic",
                pressed: editor.isActive("italic"),
                onPressedChange: () => editor.chain().focus().toggleItalic().run(),
                className: cn(editor.isActive("italic") && "bg-muted text-muted-foreground"),
                icon: <Italic/>,
            },
            {
                name: "Strike",
                pressed: editor.isActive("strike"),
                onPressedChange: () => editor.chain().focus().toggleStrike().run(),
                className: cn(editor.isActive("strike") && "bg-muted text-muted-foreground"),
                icon: <Strikethrough/>,
            },
            {
                name: "Heading level 1",
                pressed: editor.isActive("heading", { levels: 1 }),
                onPressedChange: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                className: cn(editor.isActive("heading", { levels: 1 }) && "bg-muted text-muted-foreground"),
                icon: <Heading1Icon/>,
            },
            {
                name: "Heading level 2",
                pressed: editor.isActive("heading", { levels: 2 }),
                onPressedChange: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                className: cn(editor.isActive("heading", { levels: 2 }) && "bg-muted text-muted-foreground"),
                icon: <Heading2Icon/>,
            },
            {
                name: "Heading level 3",
                pressed: editor.isActive("heading", { levels: 3 }),
                onPressedChange: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                className: cn(editor.isActive("heading", { levels: 3 }) && "bg-muted text-muted-foreground"),
                icon: <Heading3Icon/>,
            },
            {
                name: "Bullet List",
                pressed: editor.isActive("bulletList"),
                onPressedChange: () => editor.chain().focus().toggleBulletList().run(),
                className: cn(editor.isActive("bulletList") && "bg-muted text-muted-foreground"),
                icon: <ListIcon/>,
            },
            {
                name: "Order List",
                pressed: editor.isActive("orderList", { levels: 1 }),
                onPressedChange: () => editor.chain().focus().toggleOrderedList().run(),
                className: cn(editor.isActive("orderList", { levels: 1 }) && "bg-muted text-muted-foreground"),
                icon: <ListOrderedIcon/>,
            },
        ],
        formatAlign: [
            {
                name: "Align Left",
                pressed: editor.isActive({ TextAlign: "left" }),
                onPressedChange: () => editor.chain().focus().toggleTextAlign("left").run(),
                className: cn(editor.isActive({ TextAlign: "left" }) && "bg-muted text-muted-foreground"),
                icon: <AlignLeft/>,
            },
            {
                name: "Align Center",
                pressed: editor.isActive({ TextAlign: "center" }),
                onPressedChange: () => editor.chain().focus().toggleTextAlign("center").run(),
                className: cn(editor.isActive({ TextAlign: "center" }) && "bg-muted text-muted-foreground"),
                icon: <AlignCenter/>,
            },
            {
                name: "Align Right",
                pressed: editor.isActive({ TextAlign: "right" }),
                onPressedChange: () => editor.chain().focus().toggleTextAlign("right").run(),
                className: cn(editor.isActive({ TextAlign: "right" }) && "bg-muted text-muted-foreground"),
                icon: <AlignRight/>,
            }
        ],
        formatStatus: [
            {
                name: "Undo",
                stausDisabled: editor.can().undo(),
                onPressedChange: () => editor.chain().focus().undo().run(),
                icon: <Undo/>,
            },
            {
                name: "Redo",
                stausDisabled: editor.can().redo(),
                onPressedChange: () => editor.chain().focus().redo().run(),
                icon: <Redo/>,
            }
        ]
    };

    return (
        <div
            className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <FormatGroup  typeTooltip="format" dataFormat={data.formatContent} />

                <div className="w-px h-6 bg-border mx-2"></div>
                <FormatGroup typeTooltip="format" dataFormat={data.formatAlign}/>

                <div className="w-px h-6 bg-border mx-2"></div>
                <FormatGroup dataFormat={data.formatStatus}/>
            </TooltipProvider>
        </div>
    );
}