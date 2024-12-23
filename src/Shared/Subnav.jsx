import React from 'react';


const Subnav = () => {
    const xname=localStorage.getItem("xname")
    const zorg=localStorage.getItem("zorg")
    return (
        <div className='text-right mr-5'>
            <p className='text-xs'>
                User : {xname} Of {zorg}
            </p>
            <p className='text-xs'>ZAB ERP Version: 12.3.4</p>
        </div>
    );
};

export default Subnav;
