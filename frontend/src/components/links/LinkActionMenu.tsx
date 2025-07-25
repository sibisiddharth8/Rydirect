import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical, Edit, Trash2, QrCode } from 'lucide-react';

const LinkActionMenu = ({ link, onEdit, onDelete, onQrCode }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
        <MoreVertical size={18} />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onEdit(link)}
                  className={`${active ? 'bg-blue-500 text-white' : 'text-slate-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onQrCode(link.shortCode)}
                  className={`${active ? 'bg-blue-500 text-white' : 'text-slate-700'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <QrCode className="mr-2 h-4 w-4" /> QR Code
                </button>
              )}
            </Menu.Item>
            <div className="my-1 h-px bg-slate-100" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onDelete(link.id)}
                  className={`${active ? 'bg-red-500 text-white' : 'text-red-600'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LinkActionMenu;