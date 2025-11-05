import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { ContentFormatItem, StatusFormatItem } from "@/lib/type";

export default function FormatGroup({ typeTooltip, dataFormat }: { typeTooltip?: string, dataFormat: ContentFormatItem[] | StatusFormatItem[]}) {
    return (
        <div className="flex flex-wrap gap-1">
            {dataFormat.map((item: ContentFormatItem | StatusFormatItem, index) => (
                <Tooltip key={index} >
                    { typeTooltip === "format" ? (
                        <>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={(item as ContentFormatItem).pressed}
                                    onPressedChange={(item as ContentFormatItem).onPressedChange}
                                    className={(item as ContentFormatItem).className}
                                >
                                    {item.icon}
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>{(item as ContentFormatItem).name}</TooltipContent>
                        </>
                    ) : (
                        <>
                            <TooltipTrigger asChild>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={!(item as StatusFormatItem).stausDisabled}
                                onClick={(item as StatusFormatItem).onPressedChange}
                            >
                                {(item as StatusFormatItem).icon}
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>{(item as StatusFormatItem).name}</TooltipContent>
                        </>
                    )}
                </Tooltip>
            ))}
        </div>
    );
}