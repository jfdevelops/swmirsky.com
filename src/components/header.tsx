import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, BookOpen, FileText, PenTool, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navItems = [
		{ path: "/", label: "Home", icon: Home },
		{ path: "/about", label: "About", icon: PenTool },
		{ path: "/books", label: "Books", icon: BookOpen },
		{ path: "/blogs", label: "Blogs & Media", icon: FileText },
		{ path: "/posts", label: "Mirsky's Posts", icon: PenTool },
		{ path: "/contact", label: "Contact", icon: Mail },
	];

	const isActive = (path: string) => {
		if (path === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(path);
	};

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					isScrolled
						? "bg-slate-900/95 backdrop-blur-md shadow-lg"
						: "bg-slate-900/80 backdrop-blur-sm"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link
							to="/"
							className="flex items-center gap-2 text-xl font-bold text-white hover:text-amber-400 transition-colors"
						>
							<span className="font-serif">Stuart W. Mirsky</span>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								const active = isActive(item.path);
								return (
									<Link
										key={item.path}
										to={item.path}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
											active
												? "bg-amber-500/20 text-amber-400"
												: "text-gray-300 hover:text-white hover:bg-slate-800"
										}`}
									>
										<Icon size={18} />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>

						{/* Mobile Menu Button */}
						<Button
							type="button"
							onClick={() => setIsOpen(true)}
							className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
							aria-label="Open menu"
						>
							<Menu size={24} />
						</Button>
					</div>
				</div>
			</motion.header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 bg-black/50 z-40 md:hidden"
						/>
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed top-0 left-0 h-full w-80 bg-slate-900 text-white shadow-2xl z-50 flex flex-col md:hidden"
						>
							<div className="flex items-center justify-between p-4 border-b border-slate-700">
								<h2 className="text-xl font-bold font-serif">
									Stuart W. Mirsky
								</h2>
								<Button
									type="button"
									onClick={() => setIsOpen(false)}
									className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
									aria-label="Close menu"
								>
									<X size={24} />
								</Button>
							</div>

							<nav className="flex-1 p-4 overflow-y-auto">
								{navItems.map((item) => {
									const Icon = item.icon;
									const active = isActive(item.path);
									return (
										<Link
											key={item.path}
											to={item.path}
											onClick={() => setIsOpen(false)}
											className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 ${
												active
													? "bg-amber-500/20 text-amber-400"
													: "text-gray-300 hover:text-white hover:bg-slate-800"
											}`}
										>
											<Icon size={20} />
											<span className="font-medium">{item.label}</span>
										</Link>
									);
								})}
							</nav>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
