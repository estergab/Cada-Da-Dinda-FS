import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import * as z from "zod";

const requestStaySchema = z.object({
  requesterName: z.string().min(1, "Nome é obrigatório"),
  requesterEmail: z.string().email("Email inválido"),
  requesterPhone: z.string().min(1, "Telefone é obrigatório"),
  petName: z.string().min(1, "Nome do pet é obrigatório"),
  petType: z.enum(["dog", "cat"]),
  petAge: z.string().optional(),
  petSize: z.string().optional(),
  healthConditions: z.string().optional(),
  behavior: z.string().optional(),
  startDate: z.string().optional(),
  duration: z.string().optional(),
  message: z.string().optional(),
});

type RequestStayFormData = z.infer<typeof requestStaySchema>;

interface TemporaryHome {
  id: string; // ✅ UUID
  hostName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  capacity: number;
  hasYard: boolean;
  hasFence: boolean;
  experience: string;
  availableFor: string[];
  description: string;
  imageUrl: string;
  createdAt: Date;
}

const RequestStay = () => {
  const { id: homeId } = useParams();
  const navigate = useNavigate();

  const [home, setHome] = useState<TemporaryHome | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<RequestStayFormData>({
    resolver: zodResolver(requestStaySchema),
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      petName: "",
      petType: "dog",
      petAge: "",
      petSize: "",
      healthConditions: "",
      behavior: "",
      startDate: "",
      duration: "",
      message: "",
    },
  });

  // ✅ BUSCAR LAR DO BANCO
  useEffect(() => {
    const fetchHome = async () => {
      if (!homeId) {
        toast.error("ID do lar não fornecido");
        navigate("/lares");
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Buscando lar com ID:", homeId);

        const response = await api.get(`/lares/${homeId}`);
        const larData = response.data.data || response.data;

        console.log("✅ Lar carregado:", larData);

        // ✅ CORRIGIDO: usar larData.id (UUID) ao invés de larData._id
        const homeFormatted: TemporaryHome = {
          id: larData.id, // ✅ UUID (não _id)
          hostName: larData.hostName,
          email: larData.email,
          phone: larData.phone,
          city: larData.city,
          state: larData.state,
          address: larData.address,
          capacity: larData.capacity,
          hasYard: larData.hasYard,
          hasFence: larData.hasFence,
          experience: larData.experience || "",
          availableFor: Array.isArray(larData.availableFor) ? larData.availableFor : [],
          description: larData.description || "",
          imageUrl: larData.imageUrl ? `http://localhost:3335${larData.imageUrl}` : "",
          createdAt: new Date(larData.createdAt),
        };

        setHome(homeFormatted);
      } catch (error) {
        console.error("❌ Erro ao carregar lar:", error);
        toast.error("Erro ao carregar dados do lar");
        navigate("/lares");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [homeId, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RequestStayFormData) => {
    if (!home?.id) {
      toast.error("Lar não encontrado");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ DEBUG
      console.log("📤 homeId (UUID) sendo enviado:", home.id);
      console.log("📤 Dados do formulário:", data);

      const formData = new FormData();
      formData.append("homeId", home.id); // ✅ Enviar o UUID
      formData.append("requesterName", data.requesterName);
      formData.append("requesterEmail", data.requesterEmail);
      formData.append("requesterPhone", data.requesterPhone);
      formData.append("petName", data.petName);
      formData.append("petType", data.petType);

      if (data.petAge) formData.append("petAge", data.petAge);
      if (data.petSize) formData.append("petSize", data.petSize);
      if (data.healthConditions) formData.append("healthConditions", data.healthConditions);
      if (data.behavior) formData.append("behavior", data.behavior);
      if (data.startDate) formData.append("startDate", data.startDate);
      if (data.duration) formData.append("duration", data.duration);
      if (data.message) formData.append("message", data.message);
      if (imageFile) formData.append("petImage", imageFile);

      console.log("📤 Enviando solicitação...");

      await api.post("/solicitacoes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Solicitação enviada com sucesso! 🎉", {
        description: "O anfitrião entrará em contato em breve.",
      });

      setTimeout(() => navigate("/lares"), 2000);
    } catch (error: any) {
      console.error("❌ Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação", {
        description: error.response?.data?.message || "Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  // Lar não encontrado
  if (!home) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <Card>
            <CardContent className="py-12">
              <p className="text-lg text-muted-foreground mb-4">Lar não encontrado</p>
              <Button onClick={() => navigate("/lares")}>
                Voltar para listagem
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Estadia</CardTitle>
            <CardDescription>
              Solicitando estadia para o lar de {home.hostName} em {home.city}, {home.state}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Suas Informações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Suas Informações</h3>

                  <FormField
                    control={form.control}
                    name="requesterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Nome Completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="João Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requesterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="joao@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requesterPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 98765-4321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Informações do Pet */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações do Pet</h3>

                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pet *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rex" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Animal *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dog" id="dog" />
                              <label htmlFor="dog">Cão</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cat" id="cat" />
                              <label htmlFor="cat">Gato</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade Aproximada</FormLabel>
                        <FormControl>
                          <Input placeholder="2 anos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porte</FormLabel>
                        <FormControl>
                          <Input placeholder="Médio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condições de Saúde</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Vacinado, castrado..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="behavior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comportamento</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Calado, passa bastante tempo deitado." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <label className="text-sm font-medium">Foto do Pet</label>
                    <div
                      className="mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => document.getElementById('petImage')?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      ) : (
                        <div>
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">Clique para fazer upload</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="petImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Detalhes da Estadia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detalhes da Estadia</h3>

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração Estimada</FormLabel>
                        <FormControl>
                          <Input placeholder="1 Semana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem para o Anfitrião</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Já fui lar temporário para cães idosos e com necessidades especiais."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestStay;
