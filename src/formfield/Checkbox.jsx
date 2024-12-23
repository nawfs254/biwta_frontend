function Checkbox({ checked, onChange,name }) {
    return (
        
            <div className="relative z-0 w-full mb-0 group col-span-2 flex items-center">
                <input
                    type="checkbox"
                    name="active"
                    id="active"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 peer"
                    checked={checked}
                    onChange={onChange}
                />
                <label
                    htmlFor="active"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-400 peer-focus:text-blue-600"
                >
                    {name}
                </label>
            </div>
        
    );
}

export default Checkbox;
