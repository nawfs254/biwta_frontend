

function TextField({ name, id, value, onChange,viewName,className,pattern }) {
   

    return (
        <div className={`relative z-0 w-full mb-5 group ${className}`}>
            <input
                type="text"
                name={name}
                id={id}
                pattern={`${pattern}`}
                className={`inputfieldborder peer`}
                placeholder=" "
                value={value}
                onChange={onChange}
                required
            />
            <label
                htmlFor={name}
                className="peer-focus:font-medium absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
            >
                {viewName}
            </label>
        </div>
    );
}

export default TextField;
