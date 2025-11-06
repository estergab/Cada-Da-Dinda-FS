import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PawPrint, Home, Edit, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import { toast } from "sonner";

interface Solicitacao {
  _id: string;
  id: string;
  homeId: string;
  hostEmail: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  petName: string;
  petType: string;
  petImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  startDate: string;
  createdAt: string;
}

interface Lar {
  _id: string;
  id: string;
  hostName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  capacity: number;
  imageUrl?: string;
  isActive: boolean;
}

const SolicitacoesList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [meuLar, setMeuLar] = useState<Lar | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const email = searchParams.get("email") || localStorage.getItem("userEmail") || "";
  const isTutor = searchParams.get("type") === "tutor";

  console.log("👤 Email do usuário logado:", email);
  console.log("📋 Tipo de usuário:", isTutor ? "Tutor" : "Anfitrião");

  useEffect(() => {
    if (!email) {
      toast.error("Email não fornecido. Faça login novamente.");
      navigate("/solicitacoes");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // ✅ Buscar solicitações
        const solicitacoesResponse = await api.get(`/solicitacoes/email/${email}`);
        const solicitacoesData = solicitacoesResponse.data.data || solicitacoesResponse.data;
        
        console.log("✅ Solicitações carregadas:", solicitacoesData);
        setSolicitacoes(Array.isArray(solicitacoesData) ? solicitacoesData : []);

        // ✅ Buscar lar do anfitrião (se tiver)
        if (!isTutor) {
          try {
            const larResponse = await api.get(`/lares/email/${email}`);
            const larData = larResponse.data.data || larResponse.data;
            
            console.log("🏠 Lar do anfitrião:", larData);
            setMeuLar(larData);
          } catch (larError: any) {
            if (larError.response?.status !== 404) {
              console.error("❌ Erro ao buscar lar:", larError);
            }
          }
        }

      } catch (error: any) {
        console.error("❌ Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [email, isTutor, navigate]);

  // ✅ FORMATAR DATA
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // ✅ GET STATUS BADGE
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">✅ Aprovada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">❌ Negada</Badge>;
      default:
        return <Badge variant="secondary">⏳ Pendente</Badge>;
    }
  };

  // ✅ NAVEGAR PARA DETALHES DA SOLICITAÇÃO
  const handleSolicitacaoClick = (solicitacao: Solicitacao) => {
    navigate(`/solicitacoes/${solicitacao.id}?email=${encodeURIComponent(email)}`);
  };

  // ✅ NAVEGAR PARA EDITAR ANÚNCIO
  const handleEditarLar = () => {
    if (meuLar) {
      navigate(`/lares/${meuLar._id}/editar?email=${encodeURIComponent(email)}`);
    }
  };

  // ✅ ATIVAR/DESATIVAR LAR
  const handleToggleLar = async () => {
    if (!meuLar) return;

    try {
      const response = await api.patch(`/lares/${meuLar._id}/toggle-active`);
      const updatedLar = response.data.data;
      
      setMeuLar(updatedLar);
      toast.success(response.data.message || `Lar ${updatedLar.isActive ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error: any) {
      console.error("❌ Erro ao alterar status do lar:", error);
      toast.error("Erro ao alterar status do lar");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando solicitações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* HEADER */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Voltar
          </Button>
          <h1 className="text-4xl font-bold mb-2">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas solicitações de estadia
          </p>
        </div>

        {/* ✅ SEÇÃO DE SOLICITAÇÕES */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-primary" />
              {isTutor ? "Minhas Solicitações Enviadas" : "Solicitações Recebidas"}
            </h2>
            <Badge variant="outline">{solicitacoes.length} solicitação(ões)</Badge>
          </div>

          {solicitacoes.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                Você ainda não tem solicitações
              </p>
              {isTutor && (
                <Button onClick={() => navigate("/lares")}>
                  Buscar Lares Temporários
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  onClick={() => handleSolicitacaoClick(solicitacao)}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* FOTO DO PET */}
                    <div className="flex-shrink-0">
                      {solicitacao.petImageUrl ? (
                        <img
                          src={`http://localhost:3335${solicitacao.petImageUrl}`}
                          alt={solicitacao.petName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                          <PawPrint className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{solicitacao.petName}</h3>
                        {getStatusBadge(solicitacao.status)}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {solicitacao.petType === "dog" ? "🐕 Cão" : "🐱 Gato"}
                      </p>

                      <p className="text-sm text-muted-foreground mb-1">
                        {isTutor ? "Você enviou esta solicitação" : `Solicitado por ${solicitacao.requesterName}`}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        📧 {solicitacao.requesterEmail}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        📞 {solicitacao.requesterPhone}
                      </p>

                      <p className="text-sm text-muted-foreground mt-2">
                        📅 Início: {formatDate(solicitacao.startDate)}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        Enviada em: {formatDate(solicitacao.createdAt)}
                      </p>
                    </div>

                    {/* BOTÃO VER DETALHES */}
                    <div className="flex-shrink-0">
                      <Button variant="default" size="default">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ SEÇÃO MEU ANÚNCIO (SÓ PARA ANFITRIÃO) */}
        {!isTutor && meuLar && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                Meu Anúncio
              </h2>
              <Badge variant={meuLar.isActive ? "default" : "secondary"}>
                {meuLar.isActive ? "✅ Ativo" : "❌ Desativado"}
              </Badge>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-start gap-4">
                {/* FOTO DO LAR */}
                <div className="flex-shrink-0">
                  {meuLar.imageUrl ? (
                    <img
                      src={`http://localhost:3335${meuLar.imageUrl}`}
                      alt={meuLar.hostName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* INFORMAÇÕES DO LAR */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2">{meuLar.hostName}</h3>

                  <p className="text-sm text-muted-foreground mb-1">
                    📍 {meuLar.city}, {meuLar.state}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    📞 {meuLar.phone}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    👥 Capacidade: {meuLar.capacity} pet(s)
                  </p>

                  <p className="text-sm text-muted-foreground mt-2">
                    Status: {meuLar.isActive ? "🟢 Visível na listagem" : "🔴 Oculto da listagem"}
                  </p>
                </div>

                {/* BOTÕES EDITAR E DESATIVAR */}
                <div className="flex-shrink-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditarLar();
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>

                  <Button
                    variant={meuLar.isActive ? "destructive" : "default"}
                    size="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLar();
                    }}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {meuLar.isActive ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitacoesList;
