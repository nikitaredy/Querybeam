"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { Bot, User, Loader2, ArrowUp, BarChart3, FileText, Calendar, Search, Paperclip, X } from "lucide-react"
import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function ChatbotUI() {
  const { messages, append, isLoading, setMessages } = useChat({
    api: "/api/chat",
  })

  const [input, setInput] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showBanner, setShowBanner] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return

    let messageContent = input.trim()

    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((file) => file.name).join(", ")
      messageContent = `${messageContent}\n\n[Attached files: ${fileNames}]`
    }

    setInput("")
    setAttachedFiles([])

    await append({
      role: "user",
      content: messageContent,
    })
  }

  const handleNewChat = () => {
    setMessages([])
    setInput("")
    setAttachedFiles([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const suggestions = [
    { text: "Analyze financial performance metrics", icon: BarChart3 },
    { text: "Summarize key document insights", icon: FileText },
    { text: "Extract important dates and deadlines", icon: Calendar },
    { text: "Compare multiple document sections", icon: Search },
  ]

  return (
    <SidebarProvider>
      <AppSidebar onNewChat={handleNewChat} />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background transition-colors duration-300">
          {/* Header - Only show if showBanner is true */}
          {showBanner && (
            <div className="flex items-center justify-between border-b border-border px-8 py-6 bg-background/80 backdrop-blur-sm transition-colors duration-300">
              <div className="flex items-center gap-4 animate-in fade-in-0 slide-in-from-left-4 duration-500">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="h-8 w-8 p-0 hover:bg-accent rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-right-4 duration-500">
                <div className="px-3 py-1.5 bg-accent rounded-full transition-colors duration-300">
                  <span
                    className="text-xs font-bold text-accent-foreground tracking-wider transition-colors duration-300"
                    style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                  >
                    FREE TIER
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-semibold border-border hover:bg-accent bg-transparent rounded-2xl transition-all duration-300 hover:scale-105"
                  style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/30 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-8 py-12">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-8">
                  {/* Hero Section */}
                  <div className="space-y-6 animate-in fade-in-0 zoom-in-95 duration-700">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 transition-all duration-500 hover:scale-105 hover:rotate-3">
                        <div className="w-12 h-12 bg-primary-foreground rounded-2xl flex items-center justify-center transition-colors duration-300">
                          <Bot className="w-6 h-6 text-primary transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2
                        className="text-4xl font-bold text-foreground transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        WELCOME TO QUERYBEAM!
                      </h2>
                      <p
                        className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        Ask questions, analyze documents, and get intelligent insights powered by advanced AI.
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion.text)}
                        className="group p-6 text-left border border-border rounded-3xl hover:border-ring hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center group-hover:bg-accent/80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <suggestion.icon className="w-5 h-5 text-accent-foreground transition-colors duration-300" />
                          </div>
                          <div>
                            <p
                              className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors duration-300"
                              style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                            >
                              {suggestion.text}
                            </p>
                            <p
                              className="text-sm text-muted-foreground mt-1 font-medium transition-colors duration-300"
                              style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                            >
                              Click to try →
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8 pt-8 border-t border-border transition-colors duration-300 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold text-foreground transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        10K+
                      </p>
                      <p
                        className="text-sm text-muted-foreground font-medium transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        Conversations
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold text-foreground transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        99.9%
                      </p>
                      <p
                        className="text-sm text-muted-foreground font-medium transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        Accuracy Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className="text-2xl font-bold text-foreground transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        24/7
                      </p>
                      <p
                        className="text-sm text-muted-foreground font-medium transition-colors duration-300"
                        style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      >
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-6 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-4 duration-500`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {message.role === "assistant" && (
                        <div className="w-10 h-10 bg-primary rounded-3xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 hover:scale-105">
                          <Bot className="w-5 h-5 text-primary-foreground transition-colors duration-300" />
                        </div>
                      )}

                      <div
                        className={`max-w-2xl px-6 py-4 rounded-3xl transition-all duration-300 hover:scale-[1.01] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-16 shadow-lg shadow-primary/20"
                            : "bg-accent/80 text-accent-foreground border border-border mr-16 backdrop-blur-sm"
                        }`}
                      >
                        <p
                          className="text-sm leading-relaxed whitespace-pre-wrap font-medium transition-colors duration-300"
                          style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                        >
                          {message.content}
                        </p>
                        {index === messages.length - 1 && message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border transition-colors duration-300">
                            <span
                              className="text-xs text-muted-foreground font-medium transition-colors duration-300"
                              style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                            >
                              Response generated in 1.2s
                            </span>
                          </div>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="w-10 h-10 bg-accent rounded-3xl flex items-center justify-center flex-shrink-0 mt-1 border border-border transition-all duration-300 hover:scale-105">
                          <User className="w-5 h-5 text-accent-foreground transition-colors duration-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-6 justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                      <div className="w-10 h-10 bg-primary rounded-3xl flex items-center justify-center flex-shrink-0 mt-1 transition-colors duration-300">
                        <Bot className="w-5 h-5 text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div className="bg-accent/80 border border-border px-6 py-4 rounded-3xl mr-16 backdrop-blur-sm transition-colors duration-300">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground transition-colors duration-300" />
                          <span
                            className="text-sm text-muted-foreground font-medium transition-colors duration-300"
                            style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                          >
                            Analyzing your request...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-border px-8 py-6 bg-background/80 backdrop-blur-sm transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
              {/* Attached Files */}
              {attachedFiles.length > 0 && (
                <div className="mb-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-accent rounded-2xl border border-border transition-all duration-300 hover:scale-105"
                      >
                        <FileText className="w-4 h-4 text-accent-foreground" />
                        <span
                          className="text-sm font-medium text-accent-foreground max-w-32 truncate"
                          style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                        >
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-5 w-5 p-0 hover:bg-accent/80 rounded-full transition-all duration-300 hover:scale-110"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-4 p-4 border border-border rounded-3xl bg-card shadow-lg shadow-primary/5 focus-within:border-ring focus-within:shadow-xl focus-within:shadow-primary/10 transition-all duration-300">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <div className="flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="w-full bg-transparent border-none outline-none text-sm placeholder-muted-foreground font-medium resize-none min-h-[20px] max-h-32 text-foreground transition-colors duration-300"
                      style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
                      disabled={isLoading}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                    size="sm"
                    className="h-10 w-10 p-0 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 disabled:hover:scale-100"
                  >
                    <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-[-1px]" />
                  </Button>
                </div>
              </form>

              <div
                className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground font-medium transition-colors duration-300"
                style={{ fontFamily: "var(--font-bricolage-grotesque)" }}
              >
                <span>Press Enter to send</span>
                <span>•</span>
                <span>Shift + Enter for new line</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
