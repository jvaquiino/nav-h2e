import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Blog } from '@/generated/prisma';
import { MultiStepForm, type Step } from '@/components/ui/multi-step-form';
import toast from 'react-hot-toast';
import TagEditor from '@/components/common/TagEditor';
import { uploadImage } from '@/actions/uploads';
import { getErrorMessage } from '@/utils/api-error';
import { Loader2, Upload } from 'lucide-react';

export type BlogFormData = Omit<Blog, 'id' | 'publishedAt' | 'updatedAt'>;

interface BlogFormProps {
  editingBlog?: Blog | null;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  submitText?: string;
  loading?: boolean;
}

const EMPTY_BLOG: BlogFormData = {
  name: '',
  description: '',
  slug: '',
  imageUrl: null,
  tags: [],
  archived: false,
};

export function BlogForm({ 
  editingBlog, 
  onSubmit, 
  onCancel, 
  submitText = "Adicionar Blog →",
  loading = false 
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(
    editingBlog ? { ...editingBlog } : { ...EMPTY_BLOG }
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData((prev) => ({ ...prev, slug }));
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const publicUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao enviar imagem'));
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const steps: Step[] = [
    {
      id: 'basic-info',
      title: 'Informações Básicas',
      validation: () => !!formData.name.trim() || !!formData?.description?.trim(),
      content: (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Blog *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Ex: Avanços em células a combustível"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Breve descrição do blog"
            />
          </div>
        </>
      )
    },
    {
      id: "meta-infos",
      title: "Meta Infos",
      validation: () => !!formData.slug.trim(),
      content: (
        <>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug*</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="curso-de-astronomia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagEditor tags={formData.tags} onChange={handleTagsChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem de Capa</Label>
            <div className="flex items-center gap-3">
              {formData.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.imageUrl}
                  alt="Capa"
                  className="h-12 w-12 rounded object-cover border"
                />
              )}
              <label className="flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer hover:bg-accent">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {formData.imageUrl ? 'Trocar imagem' : 'Enviar imagem'}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>
        </>
      ),
    },
  ];

  
  const handleSubmit = async (data: typeof EMPTY_BLOG) => {
    if (loading) {
      return;
    }
    try {
      await onSubmit(data);
    } catch (error: unknown) {
      toast.error((error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <MultiStepForm
      steps={steps}
      onComplete={handleSubmit}
      onCancel={onCancel}
      submitText={submitText}
      cancelText="Cancelar"
      continueText="Continuar"
      backText="Voltar"
      initialData={formData}
      className="space-y-6"
    />
  );
}