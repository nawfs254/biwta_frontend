import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TextField,
    Box,
    Typography,
    Button,
    Modal,
} from '@mui/material';
import { useAuth } from '../../../Provider/AuthProvider';
import LoadingPage from '../../Loading/Loading';
import HelmetTitle from '../../../utility/HelmetTitle';
import SideButtons from '../../../Shared/SideButtons';
import Caption from '../../../utility/Caption';
import DynamicDropdown from '../../../ReusableComponents/DynamicDropdown';
import XlongDropDown from '../../../ReusableComponents/XlongDropDown';

const Currentstock = () => {






    return (

        <div>
            <HelmetTitle title="Current Product Stock" />
            <div className='grid grid-cols-12 gap-1 mb-2'>
                <div className='col-span-1'>
                </div>

            </div>



            <div className="grid grid-cols-12">
                <Box sx={{
                    gridColumn: 'span 12',
                    borderRadius: '8px',

                }}>
                    <div className=" rounded">
                        <div className="w-full  py-2 pt-0 mx-auto ">
                            <Caption title="Check Current Product Stock" />
                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { my: 1 },
                                    mx: 'auto',
                                    gap: 2,
                                    px: 1,
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                }}
                                autoComplete="off"
                            >

                                <Box
                                    display="grid"
                                    gridTemplateColumns="repeat(3, 1fr)"
                                    gap={2}
                                    mb={2}
                                >
                                    
                                </Box>

                            </Box>


                        </div>
                    </div>
                </Box >
            </div >
        </div>
    );
};

export default Currentstock;
