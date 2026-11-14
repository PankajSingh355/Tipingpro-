import { TypingProLogo } from './Logo.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const FOOTER_GROUPS = [
  {
    heading: 'Typing Tests',
    links: [
      { label: 'Typing Test', href: '/typing-test/' },
      { label: 'English Typing Test', href: '/english-typing-test/' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/' },
      { label: '1-Minute Speed Test', href: '/typing-speed-test-1-minute/' },
      { label: '5-Minute Speed Test', href: '/typing-speed-test-5-minute/' },
      { label: '10-Minute Speed Test', href: '/typing-speed-test-10-minute/' },
    ],
  },
  {
    heading: 'Practice & Learning',
    links: [
      { label: 'Typing Practice', href: '/typing-practice/' },
      { label: 'Hindi Typing Practice', href: '/hindi-typing-practice/' },
      { label: 'Typing Lessons', href: '/typing-lessons/' },
      { label: 'Typing Games', href: '/typing-games/' },
      { label: 'Typing Tips', href: '/typing-tips/' },
      { label: 'Practice Report', href: '/typing-certificate/' },
    ],
  },
  {
    heading: 'Guides & Exam Prep',
    links: [
      { label: 'For Beginners', href: '/typing-test-for-beginners/' },
      { label: 'For Students', href: '/typing-test-for-students/' },
      { label: 'For Kids', href: '/typing-test-for-kids/' },
      { label: 'SSC Practice', href: '/typing-test-for-ssc/' },
      { label: 'CPCT Practice', href: '/cpct-typing-practice/' },
      { label: 'Blog & Articles', href: '/blog/' },
    ],
  },
  {
    heading: 'Company & Legal',
    links: [
      { label: 'About TypingPro', href: '/about/' },
      { label: 'Contact Us', href: '/contact/' },
      { label: 'Leaderboard', href: '/leaderboard/' },
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions/' },
      { label: 'Disclaimer', href: '/disclaimer/' },
      { label: 'Cookie Policy', href: '/cookie-policy/' },
    ],
  },
];

export function Footer({ onNavigate }: FooterProps) {
  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              <TypingProLogo />
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Free English and Hindi Unicode typing tests, guided touch-typing lessons, and skill-building keyboard games.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {group.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className="text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} TypingPro. Independent educational typing platform. Not officially affiliated with SSC, CPCT, or any government body.
          </p>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-slate-800 dark:hover:text-slate-200">
              Sitemap XML
            </a>
            <a href="/robots.txt" className="hover:text-slate-800 dark:hover:text-slate-200">
              Robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
