import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";

const SolicitacoesLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      toast.error("Por favor, digite seu e-mail");
      return;
    }

    setIsLoading(true);
    
    try {
      // ✅ BUSCAR SOLICITAÇÕES NO BANCO POR EMAIL
      const response = await api.get(`/solicitacoes/email/${email.toLowerCase()}`);
      
      console.log("✅ Solicitações encontradas:", response.data);
      
      const solicitacoes = response.data.data || response.data;
      
      if (!solicitacoes || solicitacoes.length === 0) {
        toast.error(
          "Você ainda não possui interações na comunidade. Faça seu cadastro como Tutor ou Anfitrião e gerencie suas solicitações."
        );
      } else {
        // ✅ REDIRECIONAR COM EMAIL PARA VER SOLICITAÇÕES
        navigate(`/solicitacoes/lista?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      console.error("❌ Erro ao buscar solicitações:", error);
      
      // Se retornar 404 ou array vazio, significa que não tem solicitações
      if (error.response?.status === 404 || error.response?.data?.data?.length === 0) {
        toast.error(
          "Você ainda não possui interações na comunidade. Faça seu cadastro como Tutor ou Anfitrião e gerencie suas solicitações."
        );
      } else {
        toast.error("Erro ao buscar solicitações. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Minhas Solicitações</CardTitle>
            <CardDescription>
              Digite seu e-mail para visualizar suas solicitações de hospedagem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleContinue()}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Continuar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolicitacoesLogin;
