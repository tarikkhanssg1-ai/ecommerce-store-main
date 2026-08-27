import { FiFacebook, FiInstagram, FiTwitter, FiMail } from "react-icons/fi";

const footerLinks = [
  {
    title: "Shop",
    links: ["New Arrivals", "Best Sellers", "Deals", "Gift Cards"],
  },
  {
    title: "Support",
    links: ["Help Center", "Track Order", "Returns", "Shipping Info"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <span className="text-2xl font-extrabold text-white">
            Shop<span className="text-brand-500">Ease</span>
          </span>
          <p className="mt-3 text-sm text-gray-400 max-w-xs">
            Everything you need, delivered fast. Quality products at prices you'll love.
          </p>
          <div className="flex gap-3 mt-4">
            {[FiFacebook, FiInstagram, FiTwitter, FiMail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-brand-600 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-brand-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
