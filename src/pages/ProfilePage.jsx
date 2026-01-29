import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Phone, MapPin, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/navigation/BottomNav';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    farmerId: '',
    location: '',
    farmSize: '',
    crops: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        farmerId: userProfile.farmerId || '',
        location: userProfile.location || '',
        farmSize: userProfile.farmSize || '',
        crops: userProfile.crops || '',
      });
    }
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success(t('profile.updateSuccess') || 'Profile updated successfully');
      } else {
        toast.error(result.message || t('errors.serverError'));
      }
    } catch (error) {
      toast.error(t('errors.serverError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: userProfile?.name || '',
      farmerId: userProfile?.farmerId || '',
      location: userProfile?.location || '',
      farmSize: userProfile?.farmSize || '',
      crops: userProfile?.crops || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen hero-bg pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border safe-top shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 touch-target transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
          </div>

          {/* Edit/Save Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{formData.name || 'Farmer'}</h2>
          <p className="text-sm text-muted-foreground">Farmer ID: {formData.farmerId}</p>
        </div>

        {/* Profile Information */}
        <div className="simple-card p-5 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg">
                {formData.name || 'Not provided'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="flex-1 text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg">
                  {formData.phone || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Farmer ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Farmer ID</label>
            <p className="text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg">
              {formData.farmerId || 'Not provided'}
            </p>
            <p className="text-xs text-muted-foreground">Farmer ID cannot be changed</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                  placeholder="Enter your location"
                />
              ) : (
                <p className="flex-1 text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg">
                  {formData.location || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div className="simple-card p-5 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Farm Information</h3>

          {/* Farm Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Farm Size (Acres)</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.farmSize}
                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                placeholder="Enter farm size in acres"
              />
            ) : (
              <p className="text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg">
                {formData.farmSize ? `${formData.farmSize} acres` : 'Not provided'}
              </p>
            )}
          </div>

          {/* Crops */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Crops Grown</label>
            {isEditing ? (
              <textarea
                value={formData.crops}
                onChange={(e) => handleInputChange('crops', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all resize-none"
                placeholder="Enter crops you grow (e.g., Rice, Wheat, Cotton)"
                rows={3}
              />
            ) : (
              <p className="text-base text-foreground px-4 py-3 bg-muted/50 rounded-lg min-h-[80px]">
                {formData.crops || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="simple-card p-5 space-y-3">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
          
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <span className="text-sm font-medium text-foreground">Change Language</span>
            <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <span className="text-sm font-medium text-foreground">Privacy Settings</span>
            <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <span className="text-sm font-medium text-foreground">Help & Support</span>
            <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
