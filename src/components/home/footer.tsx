import { Github, Twitter, Linkedin, Mail, Code, Shield, Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative pt-20 pb-8 mt-20 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}>
        </div>
      </div>

      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      
      {/* Floating code symbols */}
      <div className="absolute top-10 left-10 text-purple-500/20 animate-float">
        <Code size={24} />
      </div>
      <div className="absolute top-20 right-20 text-purple-400/20 animate-float-slow">
        <Terminal size={28} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-purple-300/20 animate-float">
        <Shield size={32} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                  Zera
                </span>
              </h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed font-medium">
              Empowering developers with{" "}
              <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent font-semibold">
                enterprise-grade
              </span>{" "}
              Web3 security solutions. Built by devs, for devs.
            </p>
            
            {/* Social Links with premium styling */}
            <div className="flex space-x-4">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" }
              ].map(({ icon: Icon, label }, index) => (
                <a
                  key={index}
                  href="#"
                  className="group relative p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                           backdrop-blur-sm border border-gray-700/50 shadow-lg
                           transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={20} className="text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {[
            {
              title: "Platform",
              links: ["Security Audit", "Code Analysis", "Gas Optimization", "Report Generation"]
            },
            {
              title: "Developer Tools",
              links: ["CLI Interface", "VS Code Extension", "GitHub Integration", "API Documentation"]
            },
            {
              title: "Community",
              links: ["Developer Hub", "Discord Server", "Bug Bounty", "Open Source"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-white mb-6 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="group flex items-center text-gray-400 font-medium tracking-wide
                               transition-all duration-300 hover:text-purple-300"
                    >
                      <span className="w-1 h-1 rounded-full bg-purple-500 mr-3 opacity-0 
                                     group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Developer-focused features highlight */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 
                       backdrop-blur-sm border border-gray-700/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-xl font-bold text-white mb-2">Ready to ship secure code?</h4>
              <p className="text-gray-300 font-medium">
                Join 10,000+ developers building safer Web3 applications with Zera.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 
                               text-white font-bold rounded-xl shadow-lg
                               border border-purple-400/30 backdrop-blur-sm
                               tracking-wide transition-all duration-300">
                Start Building
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 
                               text-gray-300 font-bold rounded-xl border border-gray-600/50
                               backdrop-blur-sm tracking-wide transition-all duration-300">
                Read Docs
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section with premium styling */}
        <div className="border-t border-gradient-to-r from-transparent via-gray-700 to-transparent pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 font-medium">
                &copy; {new Date().getFullYear()}{" "}
                <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent font-semibold">
                  Zera Security
                </span>
               
              </p>
            </div>
            <div className="flex space-x-8">
              {["Terms", "Privacy", "Security", "Status"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-purple-300 font-medium tracking-wide
                           transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
