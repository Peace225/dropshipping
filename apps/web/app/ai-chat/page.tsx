"use client";

import { useState, useEffect } from "react";
import { Send, User, Sparkles, Heart, AlertTriangle, ShieldCheck, Package, Leaf, Truck, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AiChatPage() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (currentTime) {
      setMessages([
        {
          id: "1",
          sender: "ai",
          text: "Bonjour et bienvenue chez ECLOSIA ! Je suis votre conseillère dédiée. <strong class='text-red-600 font-bold'>Je ne suis pas un professionnel de santé.</strong> Mes réponses sont informatives et centrées sur nos essentiels (comme notre culotte couche lavable So Protect SKU-BUM1 à 25,90 €, notre matelas berceau 40x80 SKU-KITBIO40X80M2 à 74,90 € ou notre coussin d'allaitement SKU-COUSAL1 à 13,90 €). Comment puis-je vous accompagner aujourd'hui ?",
          timestamp: currentTime
        }
      ]);
    }
  }, [currentTime]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickSuggestions = [
    { label: "Matelas 40x80", icon: Package, textToSend: "En savoir plus sur le matelas 40x80" },
    { label: "Couches lavables", icon: Leaf, textToSend: "Conseils sur les couches lavables" },
    { label: "Livraison", icon: Truck, textToSend: "Informations sur la livraison" },
    { label: "Aide post-partum", icon: HelpCircle, textToSend: "Aide post-partum & bien-être" }
  ];

  const handleSend = async (textToSend?: string) => {
    const content = textToSend || input;
    if (!content.trim() || loading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: content,
      timestamp: timeNow
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // ⚠️ Appel pointant vers votre route API /api/ai/chat
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          conversationId: "default-session", // Requis par votre route API avec Supabase
          message: content,
          messages: updatedMessages 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      // Adaptation selon si la route renvoie un objet message (Supabase) ou une chaîne directe
      const rawReplyText = data.message?.content || data.reply || "Réponse reçue.";
      
      const formattedReply = rawReplyText.replace(
        /Je ne suis pas un professionnel de santé\./g, 
        "<strong class='text-red-600 font-bold'>Je ne suis pas un professionnel de santé.</strong>"
      );

      const aiResponse: Message = {
        id: data.message?.id || (Date.now() + 1).toString(),
        sender: "ai",
        text: formattedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Désolée, une petite perturbation technique est survenue. Veuillez réessayer dans quelques instants. (Rappel : En cas d'urgence médicale, contactez le 15).",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] bg-gradient-to-b from-[#F9F6F0] to-[#F5EBE6]/40 py-3 sm:py-6 px-2 sm:px-6 flex flex-col justify-center">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-3">
        
        {/* Bandeau d'avertissement réglementaire ARS */}
        <div className="bg-amber-50/95 backdrop-blur-sm border border-amber-200/80 px-3 sm:px-4 py-2 rounded-xl flex items-start sm:items-center gap-2 text-amber-900 text-[11px] sm:text-xs shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5 sm:mt-0" />
          <span>
            <strong>Avertissement :</strong> Cette conseillère IA n'est pas un professionnel de santé. Pour tout besoin médical, consultez votre sage-femme ou pédiatre. Urgence : 15 / 112.
          </span>
        </div>

        {/* Fenêtre principale du Chat */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#333333]/5 overflow-hidden flex flex-col h-[78vh] sm:h-[72vh]">
          
          {/* Header du Chat */}
          <div className="bg-[#333333] text-[#F5EBE6] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/images/conseillere.jpg" 
                  alt="Conseillère ECLOSIA" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-md ring-2 ring-[#6E857B]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#333333] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-serif text-sm sm:text-lg font-bold text-white tracking-wide">
                    Conseillère ECLOSIA
                  </h1>
                  <span className="bg-[#6E857B]/40 text-[#F5EBE6] text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium hidden xs:flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#6E857B]" /> IA 24/7
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#F5EBE6]/70 truncate max-w-[180px] sm:max-w-none">Accompagnement bien-être & écoresponsable</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 px-2.5 sm:px-3.5 py-1 rounded-full text-[#F5EBE6]/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs">Actif</span>
            </div>
          </div>

          {/* Corps de la conversation */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 bg-[#FAF7F2]/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 sm:gap-3.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#333333] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                ) : (
                  <img 
                    src="/images/conseillere.jpg" 
                    alt="Conseillère" 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl object-cover shrink-0 shadow-sm ring-1 ring-[#6E857B]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[72%] p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#333333] text-white rounded-tr-sm"
                      : "bg-white text-[#333333] border border-gray-100 rounded-tl-sm whitespace-pre-line"
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  <span
                    className={`block text-[9px] sm:text-[10px] mt-1.5 text-right ${
                      msg.sender === "user" ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <img 
                  src="/images/conseillere.jpg" 
                  alt="Conseillère" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl object-cover shrink-0 shadow-sm ring-1 ring-[#6E857B]"
                />
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6E857B] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#6E857B] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#6E857B] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions rapides */}
          <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {quickSuggestions.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.textToSend)}
                  className="whitespace-nowrap text-[11px] sm:text-xs bg-[#F5EBE6]/60 hover:bg-[#F5EBE6] text-[#333333] px-3 py-1.5 sm:py-2 rounded-full transition-all border border-[#333333]/5 font-medium shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <IconComponent className="w-3 h-3 text-[#6E857B]" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Formulaire de saisie */}
          <div className="p-3 sm:p-5 bg-white border-t border-gray-100 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre question (ex: matelas 40x80...)"
                className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#6E857B] text-[#333333] placeholder:text-gray-400 bg-gray-50/50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#6E857B] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold hover:bg-[#6E857B]/90 transition-all flex items-center justify-center disabled:opacity-40 shadow-md active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[9px] sm:text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#6E857B]" /> RGPD & Sécurisé
              </span>
              <span className="flex items-center gap-1">
                Avec <Heart className="w-3 h-3 text-[#6E857B] fill-[#6E857B]" /> pour les mamans
              </span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}