import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";

// ✅ Schema de validação SIMPLIFICADO
const registerHomeSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "Estado deve ter 2 letras").transform((s) => s.toUpperCase()),
  capacity: z.coerce.number().min(1, "Mínimo 1 pet").max(20, "Máximo 20 pets"),
  hasYard: z.boolean().optional(),
  hasFence: z.boolean().optional(),
  acceptsDogs: z.boolean().optional(),
  acceptsCats: z.boolean().optional(),
  acceptsLargeDogs: z.boolean().optional(),
  acceptsPuppies: z.boolean().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  image: z.instanceof(File, { message: "Imagem é obrigatória" }),
});

type RegisterHomeForm = z.infer<typeof registerHomeSchema>;

const RegisterHome: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterHomeForm>({
    resolver: zodResolver(registerHomeSchema),
    mode: "onSubmit", // Valida apenas no submit
  });

  // ✅ Mostrar erros no console quando a validação falhar
  const onInvalid = (errors: any) => {
    console.error("❌ ERROS DE VALIDAÇÃO:", errors);
    toast.error("Por favor, preencha todos os campos obrigatórios");
  };

  const onSubmit = async (data: RegisterHomeForm) => {
    console.log("✅ FORMULÁRIO VÁLIDO! Dados:", data);

    try {
      const formData = new FormData();

      // Campos do backend
      formData.append("hostName", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("capacity", String(data.capacity));
      formData.append("hasYard", String(Boolean(data.hasYard)));
      formData.append("hasFence", String(Boolean(data.hasFence)));

      if (data.experience) formData.append("experience", data.experience);
      if (data.description) formData.append("description", data.description);

      // Array availableFor
      const availableFor: string[] = [];
      if (data.acceptsDogs) availableFor.push("Cães");
      if (data.acceptsCats) availableFor.push("Gatos");
      if (data.acceptsLargeDogs) availableFor.push("Cães de Grande Porte");
      if (data.acceptsPuppies) availableFor.push("Filhotes");

      availableFor.forEach((item) => {
        formData.append("availableFor", item);
      });

      // Imagem
      formData.append("image", data.image);

      console.log("📦 Enviando FormData...");
      formData.forEach((value, key) => {
        console.log(`  ${key}:`, value);
      });

      const response = await api.post("/lares", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Sucesso! Resposta:", response.data);

      toast.success("Lar cadastrado com sucesso!");
      setTimeout(() => navigate("/lares"), 1200);
      reset();
      setImagePreview(null);
    } catch (err: any) {
      console.error("❌ Erro:", err);
      console.error("❌ Detalhes:", err.response?.data);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "Erro ao cadastrar. Tente novamente.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Home className="h-8 w-8 text-primary" />
                Cadastrar Lar Temporário
              </CardTitle>
              <CardDescription>
                Preencha as informações para oferecer um lar temporário.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* ✅ ADICIONE onInvalid aqui */}
              <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Suas Informações</h3>
                  
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input id="name" placeholder="Seu nome" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="email@exemplo.com" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input id="phone" placeholder="(11) 98765-4321" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  
                  <div>
                    <Label htmlFor="address">Endereço *</Label>
                    <Input id="address" placeholder="Rua, número" {...register("address")} />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade *</Label>
                      <Input id="city" placeholder="São Paulo" {...register("city")} />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state">Estado *</Label>
                      <Input id="state" placeholder="SP" maxLength={2} {...register("state")} />
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sobre o Lar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sobre o Lar</h3>
                  
                  <div>
                    <Label htmlFor="capacity">Capacidade (pets) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={1}
                      defaultValue={1}
                      {...register("capacity")}
                    />
                    {errors.capacity && (
                      <p className="text-sm text-red-500 mt-1">{errors.capacity.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Características</Label>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="hasYard"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="yard"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label htmlFor="yard" className="text-sm cursor-pointer">
                        Possui quintal
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="hasFence"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="fence"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label htmlFor="fence" className="text-sm cursor-pointer">
                        Quintal cercado
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aceita</Label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="dogs"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label htmlFor="dogs" className="text-sm cursor-pointer">
                          Cães
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsCats"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="cats"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label htmlFor="cats" className="text-sm cursor-pointer">
                          Gatos
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsLargeDogs"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="large-dogs"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label htmlFor="large-dogs" className="text-sm cursor-pointer">
                          Cães de Grande Porte
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="acceptsPuppies"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="puppies"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <label htmlFor="puppies" className="text-sm cursor-pointer">
                          Filhotes
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experiência com Pets</Label>
                    <Textarea
                      id="experience"
                      placeholder="Sua experiência..."
                      rows={3}
                      {...register("experience")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição do Lar</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva seu lar..."
                      rows={4}
                      {...register("description")}
                    />
                  </div>

                  {/* Upload de Imagem */}
                  <div>
                    <Label htmlFor="image">Foto do Espaço *</Label>
                    <Controller
                      control={control}
                      name="image"
                      render={({ field: { onChange, value, ...field } }) => (
                        <>
                          <label
                            htmlFor="image"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 mt-2"
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Clique para fazer upload
                                </p>
                              </div>
                            )}
                          </label>
                          <input
                            {...field}
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </>
                      )}
                    />
                    {errors.image && (
                      <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Lar Temporário"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterHome;
