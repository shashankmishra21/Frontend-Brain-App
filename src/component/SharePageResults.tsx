import { CrossIcon } from "../icons/CrossIcon"

export function SharePageResults({  onClose }) {
    <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center">
        <div className="bg-white opacity-100 p-6 rounded-xl shadow-lg min-w-[300px]">
            <div className="flex justify-end">
                <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Add your Links</h2>

        </div>


    </div>

}