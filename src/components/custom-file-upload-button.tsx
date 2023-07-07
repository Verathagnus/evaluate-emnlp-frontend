import React, { useRef, useState } from "react";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CustomFileInput = (props: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { selectedFiles, setSelectedFiles } = props;
    //   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        setSelectedFiles(file ? [file] : []);
    };

    return (
        <div>
            {!!selectedFiles.length ? (
                <div className="p-4 mt-4 bg-violet-50 overflow-hidden text-ellipsis">
                    <p>Selected File:</p>
                    {selectedFiles.map((file: File, i: number) => (
                        <div
                            key={i}
                            className=" whitespace-nowrap flex flex-row justify-between"
                        >
                            <div className="text-violet-500">{file.name.length > 35 ? file.name.slice(0, 35)+"..." : file.name}</div>
                            <button type="button" onClick={() => setSelectedFiles([])}>
                                <XMarkIcon className="w-6 h-6 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 flex flex-col items-center gap-2 bg-violet-50 text-violet-500 rounded-lg hover:bg-violet-100 cursor-pointer ${isDraggingOver ? "border-4 border-dashed border-blue-500" : ""
                        }`}
                >
                    {isDraggingOver ? (
                        <div className="text-blue-500 py-4">Drop here to upload</div>
                    ) : (
                        <>
                            <CloudArrowUpIcon className="w-6 h-6" />
                            <span>Choose a file to upload</span>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomFileInput;
