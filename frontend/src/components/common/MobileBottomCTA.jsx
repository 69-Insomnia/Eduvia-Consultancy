import { useState } from 'react';
import { Phone, MessageCircle, BookOpen } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import CounselingForm from './CounselingForm';
import Modal from './Modal';

export default function MobileBottomCTA() {
  const { settings } = useSettings();
  const [showCounseling, setShowCounseling] = useState(false);

  const phone = settings.phone2 || settings.phone || '';
  const whatsappNumber = phone.replace(/[^0-9]/g, '');

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-medium">
        <div className="flex items-stretch">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 flex flex-col items-center justify-center py-2.5 text-primary-500 hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Call</span>
            </a>
          )}
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center justify-center py-2.5 text-green-600 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">WhatsApp</span>
            </a>
          )}
          <button
            onClick={() => setShowCounseling(true)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 bg-accent-500 text-white"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Free Counseling</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={showCounseling}
        onClose={() => setShowCounseling(false)}
        title="Book Free Counseling"
        size="lg"
      >
        <CounselingForm onSuccess={() => setShowCounseling(false)} />
      </Modal>
    </>
  );
}
