import { useState, useCallback } from 'react';
import { supabaseService } from '../../../services/supabaseService';
import { logger } from '../../../utils/logger';

export const useProfileMedia = (user, setProfile) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadType, setUploadType] = useState(null); // 'avatar' or 'cover'
    const [isDedupModalOpen, setIsDedupModalOpen] = useState(false);
    const [pendingAsset, setPendingAsset] = useState(null);
    const [pendingType, setPendingType] = useState(null);
    const [isReframerOpen, setIsReframerOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState(null);
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingParentId, setPendingParentId] = useState(null);
    const [isStudioOpen, setIsStudioOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const handleReframerConfirm = useCallback(async (croppedBlob) => {
        setIsReframerOpen(false);
        const type = pendingType;
        const originalFile = pendingFile;
        let parentId = pendingParentId;

        setIsUploading(true);
        setUploadType(type);

        try {
            if (originalFile && originalFile.size > 0 && !parentId) {
                const rawResult = await supabaseService.processMediaUpload(
                    user.id,
                    originalFile,
                    'profiles',
                    'raw',
                    true
                );
                parentId = rawResult.asset.id;
            }

            const croppedFile = new File([croppedBlob], originalFile.name || 'cropped.jpg', { type: 'image/jpeg' });
            const result = await supabaseService.processMediaUpload(
                user.id,
                croppedFile,
                'profiles',
                type,
                true,
                parentId
            );

            const updatePayload = type === 'avatar'
                ? { avatar_url: result.url }
                : { cover_url: result.url };

            await supabaseService.updateProfile(user.id, updatePayload);
            const freshProfile = await supabaseService.getProfile(user.id);
            setProfile(freshProfile);

            logger.log(`[Profile] ${type} updated successfully:`, result.url);
        } catch (error) {
            logger.error(`[Profile] Error in ${type} flow:`, error);
            alert(`Error al processar la imatge: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingFile(null);
            setPendingParentId(null);
        }
    }, [user?.id, pendingType, pendingFile, pendingParentId, setProfile]);

    const handleDedupConfirm = useCallback(async () => {
        try {
            setIsDedupModalOpen(false);
            setIsUploading(true);
            setUploadType(pendingType);

            await supabaseService.registerMediaUsage(pendingAsset.id, user.id, pendingType);

            const updatePayload = pendingType === 'avatar'
                ? { avatar_url: pendingAsset.url }
                : { cover_url: pendingAsset.url };

            await supabaseService.updateProfile(user.id, updatePayload);
            const freshProfile = await supabaseService.getProfile(user.id);
            setProfile(freshProfile);

            logger.log(`[Profile] ${pendingType} updated (dedup):`, pendingAsset.url);
        } catch (error) {
            logger.error(`[Profile] Error in deduplication confirm:`, error);
        } finally {
            setIsUploading(false);
            setUploadType(null);
            setPendingAsset(null);
            setPendingType(null);
        }
    }, [user?.id, pendingType, pendingAsset, setProfile]);

    const handleReposition = async (type, displayProfile) => {
        const currentUrl = type === 'avatar' ? displayProfile.avatar_url : displayProfile.cover_url;
        if (!currentUrl) return;

        setIsUploading(true);
        try {
            const asset = await supabaseService.getMediaAssetByUrl(currentUrl);
            if (asset) {
                const parent = await supabaseService.getParentAsset(asset.id);
                if (parent) {
                    setTempImageSrc(parent.url);
                    setPendingParentId(parent.id);
                } else {
                    setTempImageSrc(asset.url);
                    setPendingParentId(asset.id);
                }
            } else {
                setTempImageSrc(currentUrl);
                setPendingParentId(null);
            }

            setPendingFile(new File([], 'repositioning.jpg', { type: 'image/jpeg' }));
            setPendingType(type);
            setIsReframerOpen(true);
        } catch (error) {
            logger.error('Error in handleReposition:', error);
            setTempImageSrc(currentUrl);
            setPendingFile(new File([], 'repositioning.jpg', { type: 'image/jpeg' }));
            setPendingParentId(null);
            setPendingType(type);
            setIsReframerOpen(true);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setTempImageSrc(e.target.result);
            setPendingFile(file);
            setPendingType(type);
            setPendingParentId(null);
            setIsReframerOpen(true);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handlePickerSelect = async (asset) => {
        setIsPickerOpen(false);
        setUploadType(pendingType);
        setTempImageSrc(asset.url);
        if (asset.parent_id) {
            setPendingParentId(asset.parent_id);
        } else {
            setPendingParentId(asset.id);
        }
        setPendingFile(new File([], asset.url.split('/').pop() || 'image.jpg', { type: asset.mime_type }));
        setIsReframerOpen(true);
    };

    return {
        isUploading,
        uploadType,
        isDedupModalOpen,
        setIsDedupModalOpen,
        pendingAsset,
        setPendingAsset,
        pendingType,
        setPendingType,
        isReframerOpen,
        setIsReframerOpen,
        tempImageSrc,
        pendingFile,
        pendingParentId,
        isStudioOpen,
        setIsStudioOpen,
        isPickerOpen,
        setIsPickerOpen,
        handleReframerConfirm,
        handleDedupConfirm,
        handleReposition,
        handleFileChange,
        handlePickerSelect
    };
};
