import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Italic,
    ListIcon,
    ListOrderedIcon,
    Redo,
    Strikethrough,
    Undo
} from "lucide-react";

type AppProps = {
    editor: Editor | null;
}

export default function MenuBar( { editor }: AppProps ) {
    if ( !editor ) {
        return null;
    }
    return (
        <div
            className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bold")}
                                onPressedChange={() => editor.chain().focus().run()}
                                className={cn(
                                    editor.isActive("bold") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Bold/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("italic")}
                                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                                className={cn(
                                    editor.isActive("italic") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Italic/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("strike")}
                                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                                className={cn(
                                    editor.isActive("strike") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Strikethrough/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { levels: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={cn(
                                    editor.isActive("heading", { levels: 1 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading1Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading level 1</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { levels: 2 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={cn(
                                    editor.isActive("heading", { levels: 2 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading2Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading level 2</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("heading", { levels: 3 })}
                                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={cn(
                                    editor.isActive("heading", { levels: 3 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <Heading3Icon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading level 3</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("bulletList")}
                                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                                className={cn(
                                    editor.isActive("bulletList") && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListIcon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive("orderList", { levels: 1 })}
                                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                                className={cn(
                                    editor.isActive("orderList", { levels: 1 }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <ListOrderedIcon/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Order List</TooltipContent>
                    </Tooltip>
                </div>
                <div className="w-px h-6 bg-border mx-2"></div>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ TextAlign: "left" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                                className={cn(
                                    editor.isActive({ TextAlign: "left" }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <AlignLeft/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ TextAlign: "center" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                                className={cn(
                                    editor.isActive({ TextAlign: "center" }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <AlignCenter/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={editor.isActive({ TextAlign: "right" })}
                                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                                className={cn(
                                    editor.isActive({ TextAlign: "right" }) && "bg-muted text-muted-foreground"
                                )}
                            >
                                <AlignRight/>
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                    </Tooltip>
                </div>
                <div className="w-px h-6 bg-border mx-2"></div>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={!editor.can().undo()}
                                onClick={() => editor.chain().focus().undo().run()}
                            >
                                <Undo/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={!editor.can().redo()}
                                onClick={() => editor.chain().focus().redo().run()}
                            >
                                <Redo/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}