import { motion } from 'framer-motion';
import { Calendar, DollarSign, GraduationCap, MapPin, ExternalLink } from 'lucide-react';
import { formatDateShort } from '../../utils/helpers';
import useSpotlight from '../../hooks/useSpotlight';

const typeStyles = {
  merit: 'bg-primary-50 text-primary-700',
  need: 'bg-accent-50 text-accent-700',
  sports: 'bg-green-50 text-green-700',
  research: 'bg-amber-50 text-amber-700',
  general: 'bg-dark-100 text-dark-600',
};

export default function ScholarshipCard({ scholarship }) {
  const { name, university, country, amount, deadline, type, link, description } = scholarship;
  const spotRef = useSpotlight();

  const formattedDeadline = formatDateShort(deadline, '');

  const details = [
    { Icon: GraduationCap, value: university },
    { Icon: MapPin, value: country },
    { Icon: DollarSign, value: amount },
    { Icon: Calendar, value: formattedDeadline && `Deadline: ${formattedDeadline}` },
  ].filter((d) => d.value);

  return (
    <motion.div
      ref={spotRef}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="spotlight flex h-full flex-col rounded-2xl border border-dark-200/70 bg-white p-5 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-medium"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          title={name}
          className="flex-1 font-display font-semibold leading-snug text-dark-900 line-clamp-2"
        >
          {name}
        </h3>
        {type && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
              typeStyles[type?.toLowerCase()] || typeStyles.general
            }`}
          >
            {type}
          </span>
        )}
      </div>

      {details.length > 0 && (
        <ul className="mb-4 space-y-2">
          {details.map(({ Icon, value }, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-dark-500">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dark-400" aria-hidden="true" />
              <span className="leading-snug">{value}</span>
            </li>
          ))}
        </ul>
      )}

      {description && (
        <p className="mb-4 text-sm leading-relaxed text-dark-400 line-clamp-2">{description}</p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600"
        >
          Learn More
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </motion.div>
  );
}
