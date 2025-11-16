import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PLANS } from '../../config/plansConfig';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  featureName?: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  reason,
  featureName,
}: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/account');
  };

  const proPlan = PLANS.pro;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to Pro"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Not Now
          </Button>
          <Button onClick={handleUpgrade}>See Pro Plans</Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Reason */}
        {reason && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">{reason}</p>
          </div>
        )}

        {/* Feature highlight */}
        {featureName && (
          <div className="text-center py-3">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {featureName}
            </h3>
            <p className="text-sm text-neutral-600">
              This feature is available in Pro
            </p>
          </div>
        )}

        {/* Pro benefits */}
        <div>
          <h4 className="font-medium text-neutral-900 mb-3">
            Horalix Halo Pro includes:
          </h4>
          <div className="space-y-2">
            {proPlan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-sm text-neutral-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-primary-900 mb-1">
            {proPlan.price}
          </div>
          <p className="text-sm text-primary-700">
            Unlock unlimited power
          </p>
        </div>

        {/* Note about free tier */}
        <p className="text-xs text-neutral-500 text-center">
          Your Free tier data will be preserved when you upgrade
        </p>
      </div>
    </Modal>
  );
}
