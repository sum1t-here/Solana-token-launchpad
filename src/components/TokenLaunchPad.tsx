import { useState } from "react"

function TokenLaunchPad() {

    
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
        supply: "",
        img: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Form Data: ", formData);
    }

    return (
        <div className="flex flex-col items-center gap-1.5 mt-3">
            <div>
                <h1 className="text-2xl">Enter your Token Details</h1>
            </div>
            <div className="flex flex-col">
                <div className="w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Name:
                        </label>
                        <input
                        type="text"
                        id="name"
                        value={formData.name}
                        placeholder="Enter token name"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Symbol */}
                    <div>
                        <label htmlFor="symbol" className="block text-gray-700 font-medium mb-1">
                        Symbol:
                        </label>
                        <input
                        type="text"
                        id="symbol"
                        value={formData.symbol}
                        placeholder="Enter token symbol"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Initial Supply */}
                    <div>
                        <label htmlFor="supply" className="block text-gray-700 font-medium mb-1">
                        Initial Supply:
                        </label>
                        <input
                        type="number"
                        id="supply"
                        value={formData.supply}
                        placeholder="Enter initial supply"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="img" className="block text-gray-700 font-medium mb-1">
                        Image URL:
                        </label>
                        <input
                        type="text"
                        id="img"
                        value={formData.img}
                        placeholder="Enter image URL"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Create Token
                    </button>
                    </div>
            </div>
        </div>
    )
}

export default TokenLaunchPad
