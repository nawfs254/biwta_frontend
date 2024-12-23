import { Button } from "@mui/material";
import { FaPlus } from 'react-icons/fa';
import { HiOutlineTrash } from "react-icons/hi";


const SideButtons = ({ onAdd, onUpdate, onDelete, onClear, showAdd = true, showUpdate = true, showDelete = true, showClear = true }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 space-y-1">

            {showClear && (
                <button className="sidebtn bg-green-500  hover:bg-green-600" onClick={onClear} >
                    Clear
                </button>)
            }

            {showAdd && (
                <Button
                    variant="contained"
                    sx={{
                        // backgroundColor: '#FBBF24',
                        paddingX: 2, // equivalent to Tailwind's px-2
                        paddingY: 0.5, // equivalent to Tailwind's py-0.5
                        width: '6rem', // equivalent to Tailwind's w-24 (6rem = 24 * 0.25rem)
                        height: '2.5rem', // equivalent to Tailwind's h-10 (2.5rem = 10 * 0.25rem)
                        '&:hover': {
                            backgroundColor: '#F59E0B', // Yellow-600
                        },
                    }}
                    size="medium"
                    onClick={onAdd}
                    // startIcon={<FaPlus />} 
                >
                    Add
                </Button>
            )}

            {showUpdate && (
                <Button
                    variant="contained"
                    sx={{
                        // backgroundColor: '#f97316 ',
                        paddingX: 2, // equivalent to Tailwind's px-2
                        paddingY: 0.5, // equivalent to Tailwind's py-0.5
                        width: '6rem', // equivalent to Tailwind's w-24 (6rem = 24 * 0.25rem)
                        height: '2.5rem', // equivalent to Tailwind's h-10 (2.5rem = 10 * 0.25rem)
                        '&:hover': {
                            backgroundColor: '#f97316 ', // Yellow-600
                        },
                    }}
                    size="medium"
                    onClick={onUpdate}
                    // startIcon={<FaPlus />}
                >
                    Update
                </Button>
            )}
            {showDelete && (

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#f97316 ',
                        paddingX: 2, // equivalent to Tailwind's px-2
                        paddingY: 0.5, // equivalent to Tailwind's py-0.5
                        width: '6rem', // equivalent to Tailwind's w-24 (6rem = 24 * 0.25rem)
                        height: '2.5rem', // equivalent to Tailwind's h-10 (2.5rem = 10 * 0.25rem)
                        '&:hover': {
                            backgroundColor: '#f97316 ', // Yellow-600
                        },
                    }}
                    size="medium"
                    onClick={onDelete}
                    // startIcon={<HiOutlineTrash />} 
                >
                    Delete
                </Button>
            )}
        </div>
    );
};

export default SideButtons;
