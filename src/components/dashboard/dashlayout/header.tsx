import { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserButton } from "@civic/auth-web3/react";
import Link from "next/link";
import DashboardButton from "@/components/home/dashboardbutton";

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toast } = useToast();

  // Mock user data
  const user = {
    name: "Alex Johnson",
    avatar: "/lovable-uploads/24901535-6085-431c-b426-bd8024b37488.png", // Using the provided image as a placeholder avatar
    email: "alex.johnson@example.com",
    notifications: [
      {
        id: 1,
        message: "Your audit report is ready",
        time: "2 min ago",
        read: false,
      },
      {
        id: 2,
        message: "New security alert detected",
        time: "1 hour ago",
        read: false,
      },
      {
        id: 3,
        message: "Weekly report generated",
        time: "1 day ago",
        read: true,
      },
    ],
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    setIsProfileMenuOpen(false);
  };

  const handleProfileAction = (action: string) => {
    toast({
      title: action,
      description: `${action} action triggered`,
    });
    setIsProfileMenuOpen(false);
  };

  const handleNotificationClick = (id: number) => {
    toast({
      title: "Notification Opened",
      description: "Opening notification details",
    });
    setIsNotificationsOpen(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;

    toast({
      title: "Search Initiated",
      description: `Searching for: ${searchQuery}`,
    });
  };

  return (
    <header className="h-16 border-b border-white/10 bg-slate-900-light/10 backdrop-blur-md px-6 flex items-center justify-between z-10">
      <div>
        <h1 className="text-lg font-semibold text-black">
          
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-64"
          />
        </form>

        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-200" />
            {user.notifications.some((n) => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900-light border border-white/10 rounded-lg shadow-lg py-2 z-20">
              <h3 className="px-4 py-2 text-white font-medium border-b border-white/10">
                Notifications
              </h3>
              {user.notifications.length > 0 ? (
                <div className="max-h-72 overflow-y-auto">
                  {user.notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={`w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 ${
                        !notification.read ? "bg-white/5" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 ${
                          !notification.read ? "bg-primary" : "bg-gray-600"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm text-white">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-3 text-sm text-gray-400">
                  No notifications
                </p>
              )}
              <div className="border-t border-white/10 mt-1 pt-1">
                <button
                  className="w-full text-center py-2 text-sm text-primary hover:bg-white/5"
                  onClick={() => {
                    toast({
                      title: "Mark All Read",
                      description: "All notifications marked as read",
                    });
                    setIsNotificationsOpen(false);
                  }}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

       <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center gap-4">
            {/* Authentication Buttons */}
            <div className="text-white hover:bg-white/10">
            {user && (
        <Link
          href="/wallet"
          className="px-6 py-2 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center hover:bg-purple-600 transition-colors">
          Wallet
        </Link>
      )}</div><div>
              <UserButton />
              </div>
            {/* {/* </div>
            {/* <div className="text-white hover:bg-white/10">
              <ConnectWalletButton />
            </div> */}
            {/* Dashboard Button */}
            
            {/* <div> 
              <DashboardButton />
            </div> */}
          </div>
        </div>
        

         
      </div>
    </header>
  );
};

export default Header;
