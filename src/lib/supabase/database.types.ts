export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aceptacion: {
        Row: {
          fecha_actualizado: string | null
          fecha_creado: string
          fecha_diagnos: string | null
          generado: boolean | null
          id: number
          id_diagnostico: number | null
          id_paciente: number | null
        }
        Insert: {
          fecha_actualizado?: string | null
          fecha_creado?: string
          fecha_diagnos?: string | null
          generado?: boolean | null
          id?: number
          id_diagnostico?: number | null
          id_paciente?: number | null
        }
        Update: {
          fecha_actualizado?: string | null
          fecha_creado?: string
          fecha_diagnos?: string | null
          generado?: boolean | null
          id?: number
          id_diagnostico?: number | null
          id_paciente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aceptacion_id_diagnostico_fkey"
            columns: ["id_diagnostico"]
            isOneToOne: false
            referencedRelation: "diagnostico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aceptacion_id_paciente_fkey"
            columns: ["id_paciente"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memory: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      agent_memory_interno: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      aplicaciones_cliente: {
        Row: {
          aplicacion: string | null
          codigo: string | null
          created_at: string
          empresa_id: number | null
          estado: string | null
          fecha_actualizado: string | null
          id: number
          licencias: number | null
        }
        Insert: {
          aplicacion?: string | null
          codigo?: string | null
          created_at?: string
          empresa_id?: number | null
          estado?: string | null
          fecha_actualizado?: string | null
          id?: number
          licencias?: number | null
        }
        Update: {
          aplicacion?: string | null
          codigo?: string | null
          created_at?: string
          empresa_id?: number | null
          estado?: string | null
          fecha_actualizado?: string | null
          id?: number
          licencias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aplicaciones_cliente_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      aplicaciones_dispositivos: {
        Row: {
          created_at: string
          fecha_vinculacion: string | null
          id: number
          id_aplicacion: number | null
          id_control: number | null
          ip: string | null
          vinculado: boolean | null
        }
        Insert: {
          created_at?: string
          fecha_vinculacion?: string | null
          id?: number
          id_aplicacion?: number | null
          id_control?: number | null
          ip?: string | null
          vinculado?: boolean | null
        }
        Update: {
          created_at?: string
          fecha_vinculacion?: string | null
          id?: number
          id_aplicacion?: number | null
          id_control?: number | null
          ip?: string | null
          vinculado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "aplicaciones_dispositivos_id_aplicacion_fkey"
            columns: ["id_aplicacion"]
            isOneToOne: false
            referencedRelation: "aplicaciones_cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      artifact_stars: {
        Row: {
          artifact_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          artifact_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          artifact_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artifact_stars_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      artifact_versions: {
        Row: {
          artifact_id: string
          change_description: string | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          is_auto_save: boolean | null
          title: string | null
          version_number: number
        }
        Insert: {
          artifact_id: string
          change_description?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_auto_save?: boolean | null
          title?: string | null
          version_number: number
        }
        Update: {
          artifact_id?: string
          change_description?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_auto_save?: boolean | null
          title?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "artifact_versions_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      artifacts: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          fork_count: number | null
          forked_from: string | null
          id: string
          is_pinned: boolean | null
          is_public: boolean | null
          language: string | null
          message_id: string | null
          public_slug: string | null
          session_id: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          fork_count?: number | null
          forked_from?: string | null
          id?: string
          is_pinned?: boolean | null
          is_public?: boolean | null
          language?: string | null
          message_id?: string | null
          public_slug?: string | null
          session_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          fork_count?: number | null
          forked_from?: string | null
          id?: string
          is_pinned?: boolean | null
          is_public?: boolean | null
          language?: string | null
          message_id?: string | null
          public_slug?: string | null
          session_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artifacts_forked_from_fkey"
            columns: ["forked_from"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria_historial: {
        Row: {
          columna_nombre: string
          fecha_hora: string | null
          fila_id: number
          id: number
          metadata: Json | null
          operacion: string
          tabla_nombre: string
          usuario: string | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          columna_nombre: string
          fecha_hora?: string | null
          fila_id: number
          id?: number
          metadata?: Json | null
          operacion: string
          tabla_nombre: string
          usuario?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          columna_nombre?: string
          fecha_hora?: string | null
          fila_id?: number
          id?: number
          metadata?: Json | null
          operacion?: string
          tabla_nombre?: string
          usuario?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          agente_asignado_at: string | null
          agente_id: number | null
          chatbot_id: number
          closed_at: string | null
          closed_reason: string | null
          contexto: Json | null
          created_at: string
          empresa_id: number
          estado: string | null
          external_conversation_id: string
          external_user_id: string
          external_user_name: string | null
          external_user_phone: string | null
          id: number
          mensajes_count: number | null
          prioridad: number | null
          ultimo_mensaje: string | null
          ultimo_mensaje_at: string | null
        }
        Insert: {
          agente_asignado_at?: string | null
          agente_id?: number | null
          chatbot_id: number
          closed_at?: string | null
          closed_reason?: string | null
          contexto?: Json | null
          created_at?: string
          empresa_id: number
          estado?: string | null
          external_conversation_id: string
          external_user_id: string
          external_user_name?: string | null
          external_user_phone?: string | null
          id?: number
          mensajes_count?: number | null
          prioridad?: number | null
          ultimo_mensaje?: string | null
          ultimo_mensaje_at?: string | null
        }
        Update: {
          agente_asignado_at?: string | null
          agente_id?: number | null
          chatbot_id?: number
          closed_at?: string | null
          closed_reason?: string | null
          contexto?: Json | null
          created_at?: string
          empresa_id?: number
          estado?: string | null
          external_conversation_id?: string
          external_user_id?: string
          external_user_name?: string | null
          external_user_phone?: string | null
          id?: number
          mensajes_count?: number | null
          prioridad?: number | null
          ultimo_mensaje?: string | null
          ultimo_mensaje_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_conversations_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbot_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_conversations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_integrations: {
        Row: {
          activo: boolean | null
          agente_id: number | null
          api_key_encrypted: string | null
          auth_type: string | null
          created_at: string
          distribucion_mode: string | null
          empresa_id: number
          fuera_horario_mensaje: string | null
          horario_atencion: Json | null
          id: number
          mensajes_enviados: number | null
          mensajes_recibidos: number | null
          nombre: string
          respuesta_automatica: boolean | null
          tipo: string
          ultimo_mensaje_at: string | null
          updated_at: string | null
          webhook_headers: Json | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          activo?: boolean | null
          agente_id?: number | null
          api_key_encrypted?: string | null
          auth_type?: string | null
          created_at?: string
          distribucion_mode?: string | null
          empresa_id: number
          fuera_horario_mensaje?: string | null
          horario_atencion?: Json | null
          id?: number
          mensajes_enviados?: number | null
          mensajes_recibidos?: number | null
          nombre: string
          respuesta_automatica?: boolean | null
          tipo: string
          ultimo_mensaje_at?: string | null
          updated_at?: string | null
          webhook_headers?: Json | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          activo?: boolean | null
          agente_id?: number | null
          api_key_encrypted?: string | null
          auth_type?: string | null
          created_at?: string
          distribucion_mode?: string | null
          empresa_id?: number
          fuera_horario_mensaje?: string | null
          horario_atencion?: Json | null
          id?: number
          mensajes_enviados?: number | null
          mensajes_recibidos?: number | null
          nombre?: string
          respuesta_automatica?: boolean | null
          tipo?: string
          ultimo_mensaje_at?: string | null
          updated_at?: string | null
          webhook_headers?: Json | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_integrations_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_integrations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_messages: {
        Row: {
          contenido: string
          conversation_id: number
          created_at: string
          empresa_id: number
          enviado_externo: boolean | null
          error_procesamiento: string | null
          external_message_id: string | null
          externo_error: string | null
          id: number
          metadata: Json | null
          procesado: boolean | null
          remitente: string
          tipo: string | null
        }
        Insert: {
          contenido: string
          conversation_id: number
          created_at?: string
          empresa_id: number
          enviado_externo?: boolean | null
          error_procesamiento?: string | null
          external_message_id?: string | null
          externo_error?: string | null
          id?: number
          metadata?: Json | null
          procesado?: boolean | null
          remitente: string
          tipo?: string | null
        }
        Update: {
          contenido?: string
          conversation_id?: number
          created_at?: string
          empresa_id?: number
          enviado_externo?: boolean | null
          error_procesamiento?: string | null
          external_message_id?: string | null
          externo_error?: string | null
          id?: number
          metadata?: Json | null
          procesado?: boolean | null
          remitente?: string
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_messages_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_summary: {
        Row: {
          content_md: string
          date_key: string
          email_sent_at: string | null
          generated_at: string
          id: number
          metrics: Json
        }
        Insert: {
          content_md: string
          date_key: string
          email_sent_at?: string | null
          generated_at?: string
          id?: number
          metrics?: Json
        }
        Update: {
          content_md?: string
          date_key?: string
          email_sent_at?: string | null
          generated_at?: string
          id?: number
          metrics?: Json
        }
        Relationships: []
      }
      dau_tracked_users: {
        Row: {
          about_them: string | null
          created_at: string | null
          followers: number | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          about_them?: string | null
          created_at?: string | null
          followers?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          about_them?: string | null
          created_at?: string | null
          followers?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      dau_user_tweets: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          favs: number | null
          id: string
          status: string | null
          time_posted: string | null
          tweet: string
          tweet_id: string
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          favs?: number | null
          id?: string
          status?: string | null
          time_posted?: string | null
          tweet: string
          tweet_id: string
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          favs?: number | null
          id?: string
          status?: string | null
          time_posted?: string | null
          tweet?: string
          tweet_id?: string
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dau_user_tweets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "dau_tracked_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      debug_events: {
        Row: {
          contacto_id: number | null
          created_at: string | null
          empresa_id: number | null
          id: string
          message_id: string | null
          payload: Json | null
          source: string
          stage: string
        }
        Insert: {
          contacto_id?: number | null
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          message_id?: string | null
          payload?: Json | null
          source: string
          stage: string
        }
        Update: {
          contacto_id?: number | null
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          message_id?: string | null
          payload?: Json | null
          source?: string
          stage?: string
        }
        Relationships: []
      }
      diagnostico: {
        Row: {
          afectaciones: string | null
          diagnostico: string | null
          fecha_aceptado: string | null
          fecha_creado: string
          fecha_diagnos: string | null
          id: number
          id_paciente: number | null
          notas: string | null
          procedimiento: string | null
        }
        Insert: {
          afectaciones?: string | null
          diagnostico?: string | null
          fecha_aceptado?: string | null
          fecha_creado?: string
          fecha_diagnos?: string | null
          id?: number
          id_paciente?: number | null
          notas?: string | null
          procedimiento?: string | null
        }
        Update: {
          afectaciones?: string | null
          diagnostico?: string | null
          fecha_aceptado?: string | null
          fecha_creado?: string
          fecha_diagnos?: string | null
          id?: number
          id_paciente?: number | null
          notas?: string | null
          procedimiento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostico_id_paciente_fkey"
            columns: ["id_paciente"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      dim_embedding: {
        Row: {
          content_hash: string
          embedding: unknown
          task_id: string
          updated_at: string
        }
        Insert: {
          content_hash: string
          embedding: unknown
          task_id: string
          updated_at?: string
        }
        Update: {
          content_hash?: string
          embedding?: unknown
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dim_embedding_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "dim_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dim_embedding_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "mv_task_current_state"
            referencedColumns: ["id"]
          },
        ]
      }
      dim_person: {
        Row: {
          agent_id: string | null
          bridge_url: string | null
          created_at: string
          email: string
          full_name: string | null
          is_active: boolean
          role: string
          team_humano_id: number | null
        }
        Insert: {
          agent_id?: string | null
          bridge_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          is_active?: boolean
          role: string
          team_humano_id?: number | null
        }
        Update: {
          agent_id?: string | null
          bridge_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          is_active?: boolean
          role?: string
          team_humano_id?: number | null
        }
        Relationships: []
      }
      dim_person_integration: {
        Row: {
          created_at: string
          email: string
          metadata: Json
          provider: string
          scopes: string[]
          updated_at: string
          vault_secret_id: string
          watch_expires_at: string | null
          watch_history_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          metadata?: Json
          provider: string
          scopes?: string[]
          updated_at?: string
          vault_secret_id: string
          watch_expires_at?: string | null
          watch_history_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          metadata?: Json
          provider?: string
          scopes?: string[]
          updated_at?: string
          vault_secret_id?: string
          watch_expires_at?: string | null
          watch_history_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dim_person_integration_email_fkey"
            columns: ["email"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
        ]
      }
      dim_project: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id: string
          name: string
          parent_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dim_project_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "dim_project"
            referencedColumns: ["id"]
          },
        ]
      }
      dim_task: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          metadata: Json
          owner_email: string | null
          priority: string
          project_id: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id: string
          metadata?: Json
          owner_email?: string | null
          priority?: string
          project_id?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json
          owner_email?: string | null
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dim_task_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "dim_task_owner_email_fkey"
            columns: ["owner_email"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "dim_task_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "dim_project"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_files: {
        Row: {
          carpeta_id: string | null
          carpeta_origen: string | null
          carpeta_url: string | null
          contacto_id: number | null
          contenido: string | null
          created_at: string | null
          descripccion: string | null
          doc_url: string | null
          empresa_id: number | null
          estado: string | null
          fecha_modificacion: string | null
          file_id: string
          id: number
          metadata: Json | null
          nombre: string
          tamano: string | null
          tipo_mime: string | null
          traduccion: string | null
          updated_at: string | null
          url: string
          url_storage: string | null
        }
        Insert: {
          carpeta_id?: string | null
          carpeta_origen?: string | null
          carpeta_url?: string | null
          contacto_id?: number | null
          contenido?: string | null
          created_at?: string | null
          descripccion?: string | null
          doc_url?: string | null
          empresa_id?: number | null
          estado?: string | null
          fecha_modificacion?: string | null
          file_id: string
          id?: number
          metadata?: Json | null
          nombre: string
          tamano?: string | null
          tipo_mime?: string | null
          traduccion?: string | null
          updated_at?: string | null
          url: string
          url_storage?: string | null
        }
        Update: {
          carpeta_id?: string | null
          carpeta_origen?: string | null
          carpeta_url?: string | null
          contacto_id?: number | null
          contenido?: string | null
          created_at?: string | null
          descripccion?: string | null
          doc_url?: string | null
          empresa_id?: number | null
          estado?: string | null
          fecha_modificacion?: string | null
          file_id?: string
          id?: number
          metadata?: Json | null
          nombre?: string
          tamano?: string | null
          tipo_mime?: string | null
          traduccion?: string | null
          updated_at?: string | null
          url?: string
          url_storage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_files_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_files_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_files_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones: {
        Row: {
          agente_id: number | null
          empresa_id: number | null
          evaluacion: string | null
          evaluacion_cruda: string | null
          fecha_creada: string | null
          id: string
          periodo_evaluado: Json | null
          puntuacion: number | null
        }
        Insert: {
          agente_id?: number | null
          empresa_id?: number | null
          evaluacion?: string | null
          evaluacion_cruda?: string | null
          fecha_creada?: string | null
          id?: string
          periodo_evaluado?: Json | null
          puntuacion?: number | null
        }
        Update: {
          agente_id?: number | null
          empresa_id?: number | null
          evaluacion?: string | null
          evaluacion_cruda?: string | null
          fecha_creada?: string | null
          id?: string
          periodo_evaluado?: Json | null
          puntuacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluaciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_email: {
        Row: {
          account: string
          direction: string
          from_email: string | null
          message_id: string
          sent_at: string
          snippet: string | null
          subject: string | null
          task_id: string | null
          thread_id: string | null
          to_email: string | null
        }
        Insert: {
          account: string
          direction: string
          from_email?: string | null
          message_id: string
          sent_at: string
          snippet?: string | null
          subject?: string | null
          task_id?: string | null
          thread_id?: string | null
          to_email?: string | null
        }
        Update: {
          account?: string
          direction?: string
          from_email?: string | null
          message_id?: string
          sent_at?: string
          snippet?: string | null
          subject?: string | null
          task_id?: string | null
          thread_id?: string | null
          to_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fact_email_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "dim_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fact_email_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "mv_task_current_state"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_event: {
        Row: {
          actor_email: string | null
          event_id: string
          event_type: string
          id: number
          metadata: Json
          task_id: string | null
          timestamp: string
        }
        Insert: {
          actor_email?: string | null
          event_id?: string
          event_type: string
          id?: number
          metadata?: Json
          task_id?: string | null
          timestamp?: string
        }
        Update: {
          actor_email?: string | null
          event_id?: string
          event_type?: string
          id?: number
          metadata?: Json
          task_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fact_event_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "dim_task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fact_event_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "mv_task_current_state"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas: {
        Row: {
          comparativa: Json | null
          created_at: string | null
          descripcion: string | null
          empresa_id: number | null
          fecha: string
          id: string
          meta: Json | null
          metrica: string
          valor: number
        }
        Insert: {
          comparativa?: Json | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          fecha?: string
          id?: string
          meta?: Json | null
          metrica: string
          valor: number
        }
        Update: {
          comparativa?: Json | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          fecha?: string
          id?: string
          meta?: Json | null
          metrica?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "metricas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      minijuegos_jugadores: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          empresa_id: number | null
          id: string
          nickname: string | null
          nivel: number | null
          organizacion_id: string | null
          team_member_id: number | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          nickname?: string | null
          nivel?: number | null
          organizacion_id?: string | null
          team_member_id?: number | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          nickname?: string | null
          nivel?: number | null
          organizacion_id?: string | null
          team_member_id?: number | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "minijuegos_jugadores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "minijuegos_jugadores_organizacion_id_fkey"
            columns: ["organizacion_id"]
            isOneToOne: false
            referencedRelation: "minijuegos_organizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "minijuegos_jugadores_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "minijuegos_jugadores_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      minijuegos_organizaciones: {
        Row: {
          created_at: string | null
          empresa_id: number | null
          id: string
          is_active: boolean | null
          nombre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          is_active?: boolean | null
          nombre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: number | null
          id?: string
          is_active?: boolean | null
          nombre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "minijuegos_organizaciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      monica_memories: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          importance: number | null
          metadata: Json | null
          source: string | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          source?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          importance?: number | null
          metadata?: Json | null
          source?: string | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      monica_user_profile: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          key: string
          source: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          key: string
          source?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          key?: string
          source?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      n18_autonomy: {
        Row: {
          created_at: string
          cron_id: string | null
          cron_name: string
          diego_response: string | null
          id: number
          message_summary: string
          message_type: string
          responded_at: string | null
          response_time_minutes: number | null
          week_number: number | null
        }
        Insert: {
          created_at?: string
          cron_id?: string | null
          cron_name: string
          diego_response?: string | null
          id?: number
          message_summary: string
          message_type?: string
          responded_at?: string | null
          response_time_minutes?: number | null
          week_number?: number | null
        }
        Update: {
          created_at?: string
          cron_id?: string | null
          cron_name?: string
          diego_response?: string | null
          id?: number
          message_summary?: string
          message_type?: string
          responded_at?: string | null
          response_time_minutes?: number | null
          week_number?: number | null
        }
        Relationships: []
      }
      n18_autonomy_rules: {
        Row: {
          act_rate: number | null
          created_at: string
          cron_name: string
          current_level: string
          id: number
          ignore_rate: number | null
          last_analysis_at: string | null
          notes: string | null
          total_sent: number | null
          updated_at: string
        }
        Insert: {
          act_rate?: number | null
          created_at?: string
          cron_name: string
          current_level?: string
          id?: number
          ignore_rate?: number | null
          last_analysis_at?: string | null
          notes?: string | null
          total_sent?: number | null
          updated_at?: string
        }
        Update: {
          act_rate?: number | null
          created_at?: string
          cron_name?: string
          current_level?: string
          id?: number
          ignore_rate?: number | null
          last_analysis_at?: string | null
          notes?: string | null
          total_sent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      n18_episodic: {
        Row: {
          created_at: string
          decisions: Json | null
          episode_date: string
          id: number
          mood_context: string | null
          people_mentioned: Json | null
          projects_updated: Json | null
          session_count: number | null
          summary: string
          tasks_assigned: Json | null
        }
        Insert: {
          created_at?: string
          decisions?: Json | null
          episode_date?: string
          id?: number
          mood_context?: string | null
          people_mentioned?: Json | null
          projects_updated?: Json | null
          session_count?: number | null
          summary: string
          tasks_assigned?: Json | null
        }
        Update: {
          created_at?: string
          decisions?: Json | null
          episode_date?: string
          id?: number
          mood_context?: string | null
          people_mentioned?: Json | null
          projects_updated?: Json | null
          session_count?: number | null
          summary?: string
          tasks_assigned?: Json | null
        }
        Relationships: []
      }
      n18_memory: {
        Row: {
          access_count: number
          category: string
          content: string
          created_at: string
          id: number
          importance: number
          is_active: boolean
          last_accessed_at: string | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_count?: number
          category?: string
          content: string
          created_at?: string
          id?: number
          importance?: number
          is_active?: boolean
          last_accessed_at?: string | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_count?: number
          category?: string
          content?: string
          created_at?: string
          id?: number
          importance?: number
          is_active?: boolean
          last_accessed_at?: string | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      numero18_alerts: {
        Row: {
          content: Json | null
          created_at: string
          event_type: string
          id: number
          outcome: string | null
          priority: string
          processed_at: string | null
          source: string
          status: string
          title: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          event_type?: string
          id?: number
          outcome?: string | null
          priority: string
          processed_at?: string | null
          source?: string
          status?: string
          title: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          event_type?: string
          id?: number
          outcome?: string | null
          priority?: string
          processed_at?: string | null
          source?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          correo: string | null
          created_at: string
          empresa_id: number | null
          fecha_nacimiento: string | null
          historia_medica: Json | null
          id: number
          nombre: string | null
          telefono: string | null
        }
        Insert: {
          correo?: string | null
          created_at?: string
          empresa_id?: number | null
          fecha_nacimiento?: string | null
          historia_medica?: Json | null
          id?: number
          nombre?: string | null
          telefono?: string | null
        }
        Update: {
          correo?: string | null
          created_at?: string
          empresa_id?: number | null
          fecha_nacimiento?: string | null
          historia_medica?: Json | null
          id?: number
          nombre?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscription: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: number
          p256dh: string
          user_agent: string | null
          user_email: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: number
          p256dh: string
          user_agent?: string | null
          user_email: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: number
          p256dh?: string
          user_agent?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscription_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
        ]
      }
      redaccion: {
        Row: {
          contacto_id: number | null
          contexto_structured: Json | null
          created_at: string | null
          descripcion: string | null
          estado: string | null
          id: number
          nombre: string
          tipo_id: number
          updated_at: string | null
          url_doc: string | null
        }
        Insert: {
          contacto_id?: number | null
          contexto_structured?: Json | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          id?: number
          nombre: string
          tipo_id: number
          updated_at?: string | null
          url_doc?: string | null
        }
        Update: {
          contacto_id?: number | null
          contexto_structured?: Json | null
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          id?: number
          nombre?: string
          tipo_id?: number
          updated_at?: string | null
          url_doc?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_redaccion_tipo"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "redaccion_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redaccion_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redaccion_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
        ]
      }
      redaccion_detalle_historial: {
        Row: {
          change_summary: string | null
          change_type: string
          changed_by: string | null
          contenido: string | null
          created_at: string
          detalle_id: number
          empresa_id: number
          id: number
          titulo: string | null
        }
        Insert: {
          change_summary?: string | null
          change_type?: string
          changed_by?: string | null
          contenido?: string | null
          created_at?: string
          detalle_id: number
          empresa_id: number
          id?: number
          titulo?: string | null
        }
        Update: {
          change_summary?: string | null
          change_type?: string
          changed_by?: string | null
          contenido?: string | null
          created_at?: string
          detalle_id?: number
          empresa_id?: number
          id?: number
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redaccion_detalle_historial_detalle_id_fkey"
            columns: ["detalle_id"]
            isOneToOne: false
            referencedRelation: "redaccion_detalles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redaccion_detalle_historial_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      redaccion_detalles: {
        Row: {
          contenido: string | null
          created_at: string | null
          evaluacion: number | null
          id: number
          orden: number
          plan_seccion: string | null
          redaccion_id: number
          titulo: string
          updated_at: string | null
        }
        Insert: {
          contenido?: string | null
          created_at?: string | null
          evaluacion?: number | null
          id?: number
          orden: number
          plan_seccion?: string | null
          redaccion_id: number
          titulo: string
          updated_at?: string | null
        }
        Update: {
          contenido?: string | null
          created_at?: string | null
          evaluacion?: number | null
          id?: number
          orden?: number
          plan_seccion?: string | null
          redaccion_id?: number
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_redaccion_detalle"
            columns: ["redaccion_id"]
            isOneToOne: false
            referencedRelation: "redaccion"
            referencedColumns: ["id"]
          },
        ]
      }
      redaccion_tipos: {
        Row: {
          created_at: string | null
          empresa_id: number | null
          id: number
          instrucciones: string | null
          longitud: number | null
          nombre: string
          objetivo: string | null
          partes: number | null
          requerimientos: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          instrucciones?: string | null
          longitud?: number | null
          nombre: string
          objetivo?: string | null
          partes?: number | null
          requerimientos?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: number | null
          id?: number
          instrucciones?: string | null
          longitud?: number | null
          nombre?: string
          objetivo?: string | null
          partes?: number | null
          requerimientos?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "redaccion_tipos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      reporte_preliminar: {
        Row: {
          created_at: string
          data: string | null
          id: number
          telefono: string | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          id?: number
          telefono?: string | null
        }
        Update: {
          created_at?: string
          data?: string | null
          id?: number
          telefono?: string | null
        }
        Relationships: []
      }
      shortened_links: {
        Row: {
          clicks: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          redirect_url: string
          type: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          redirect_url: string
          type: string
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          redirect_url?: string
          type?: string
          updated_at?: string | null
          uuid?: string
        }
        Relationships: []
      }
      sintetico_ejecuciones: {
        Row: {
          completed_at: string | null
          escenario_id: number | null
          estado: string | null
          id: number
          numero_sintetico: string | null
          objetivo_logrado: boolean | null
          perfil_id: number | null
          resultado: Json | null
          session_id: string | null
          started_at: string | null
          total_mensajes: number | null
        }
        Insert: {
          completed_at?: string | null
          escenario_id?: number | null
          estado?: string | null
          id?: number
          numero_sintetico?: string | null
          objetivo_logrado?: boolean | null
          perfil_id?: number | null
          resultado?: Json | null
          session_id?: string | null
          started_at?: string | null
          total_mensajes?: number | null
        }
        Update: {
          completed_at?: string | null
          escenario_id?: number | null
          estado?: string | null
          id?: number
          numero_sintetico?: string | null
          objetivo_logrado?: boolean | null
          perfil_id?: number | null
          resultado?: Json | null
          session_id?: string | null
          started_at?: string | null
          total_mensajes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sintetico_ejecuciones_escenario_id_fkey"
            columns: ["escenario_id"]
            isOneToOne: false
            referencedRelation: "sintetico_escenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sintetico_ejecuciones_numero_sintetico_fkey"
            columns: ["numero_sintetico"]
            isOneToOne: false
            referencedRelation: "sintetico_perfiles"
            referencedColumns: ["numero_sintetico"]
          },
          {
            foreignKeyName: "sintetico_ejecuciones_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "sintetico_perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sintetico_escenarios: {
        Row: {
          activo: boolean | null
          agente_id: number
          correo_informe: string | null
          created_at: string | null
          empresa_id: number
          id: number
          id_perfil: number | null
          max_mensajes: number | null
          nombre: string
          numero_id: number
          servicio: Json
        }
        Insert: {
          activo?: boolean | null
          agente_id: number
          correo_informe?: string | null
          created_at?: string | null
          empresa_id: number
          id?: number
          id_perfil?: number | null
          max_mensajes?: number | null
          nombre: string
          numero_id: number
          servicio: Json
        }
        Update: {
          activo?: boolean | null
          agente_id?: number
          correo_informe?: string | null
          created_at?: string | null
          empresa_id?: number
          id?: number
          id_perfil?: number | null
          max_mensajes?: number | null
          nombre?: string
          numero_id?: number
          servicio?: Json
        }
        Relationships: [
          {
            foreignKeyName: "sintetico_escenarios_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sintetico_escenarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sintetico_escenarios_id_perfil_fkey"
            columns: ["id_perfil"]
            isOneToOne: false
            referencedRelation: "sintetico_perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sintetico_escenarios_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: false
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
        ]
      }
      sintetico_perfiles: {
        Row: {
          activo: boolean | null
          agente_id: number | null
          created_at: string | null
          id: number
          nombre: string
          numero_sintetico: string | null
          personalidad: Json
        }
        Insert: {
          activo?: boolean | null
          agente_id?: number | null
          created_at?: string | null
          id?: number
          nombre: string
          numero_sintetico?: string | null
          personalidad: Json
        }
        Update: {
          activo?: boolean | null
          agente_id?: number | null
          created_at?: string | null
          id?: number
          nombre?: string
          numero_sintetico?: string | null
          personalidad?: Json
        }
        Relationships: []
      }
      sofia_candidatos: {
        Row: {
          calificacion: string | null
          comentario_sofia: string | null
          contacto_id: number | null
          created_at: string | null
          cv_enviado: boolean | null
          cv_url: string | null
          descripcion_experiencia: string | null
          educacion: string | null
          email: string | null
          empresa_id: number | null
          experiencia_anos: number | null
          fecha_aplicacion: string | null
          habilidades: string | null
          id: number
          idiomas: string | null
          metadata_original: Json | null
          moneda_salario: string | null
          nombre_completo: string | null
          pais: string | null
          salario_expectativa: string | null
          salario_usd_estimado: number | null
          score: number | null
          telefono: string | null
          ubicacion: string | null
          updated_at: string | null
          vacante: string | null
        }
        Insert: {
          calificacion?: string | null
          comentario_sofia?: string | null
          contacto_id?: number | null
          created_at?: string | null
          cv_enviado?: boolean | null
          cv_url?: string | null
          descripcion_experiencia?: string | null
          educacion?: string | null
          email?: string | null
          empresa_id?: number | null
          experiencia_anos?: number | null
          fecha_aplicacion?: string | null
          habilidades?: string | null
          id?: number
          idiomas?: string | null
          metadata_original?: Json | null
          moneda_salario?: string | null
          nombre_completo?: string | null
          pais?: string | null
          salario_expectativa?: string | null
          salario_usd_estimado?: number | null
          score?: number | null
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
          vacante?: string | null
        }
        Update: {
          calificacion?: string | null
          comentario_sofia?: string | null
          contacto_id?: number | null
          created_at?: string | null
          cv_enviado?: boolean | null
          cv_url?: string | null
          descripcion_experiencia?: string | null
          educacion?: string | null
          email?: string | null
          empresa_id?: number | null
          experiencia_anos?: number | null
          fecha_aplicacion?: string | null
          habilidades?: string | null
          id?: number
          idiomas?: string | null
          metadata_original?: Json | null
          moneda_salario?: string | null
          nombre_completo?: string | null
          pais?: string | null
          salario_expectativa?: string | null
          salario_usd_estimado?: number | null
          score?: number | null
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
          vacante?: string | null
        }
        Relationships: []
      }
      system_actions: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_permissions: {
        Row: {
          actions: Json
          created_at: string
          id: number
          module_id: number
          role_id: number
          updated_at: string
        }
        Insert: {
          actions?: Json
          created_at?: string
          id?: number
          module_id: number
          role_id: number
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          id?: number
          module_id?: number
          role_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_permissions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "system_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "system_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_roles: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          enterprise_id: number | null
          id: number
          is_super_admin: boolean
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          enterprise_id?: number | null
          id?: number
          is_super_admin?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          enterprise_id?: number | null
          id?: number
          is_super_admin?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_roles_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      system_users: {
        Row: {
          auth_uid: string | null
          created_at: string
          enterprise_id: number | null
          id: number
          name: string | null
          phone: string | null
          role: string | null
          role_id: number | null
          team_humano_id: number | null
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string
          enterprise_id?: number | null
          id?: number
          name?: string | null
          phone?: string | null
          role?: string | null
          role_id?: number | null
          team_humano_id?: number | null
        }
        Update: {
          auth_uid?: string | null
          created_at?: string
          enterprise_id?: number | null
          id?: number
          name?: string | null
          phone?: string | null
          role?: string | null
          role_id?: number | null
          team_humano_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_users_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "system_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_users_team_humano_id_fkey1"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "system_users_team_humano_id_fkey1"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      team_groups: {
        Row: {
          color: string | null
          created_at: string | null
          empresa_id: number
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          empresa_id: number
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          empresa_id?: number
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_groups_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_at: string
          invited_by: string | null
          status: string
          team_humano_id: number
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_at?: string
          invited_by?: string | null
          status?: string
          team_humano_id: number
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_at?: string
          invited_by?: string | null
          status?: string
          team_humano_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "team_invitations_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_contactos_sin_citas: {
        Row: {
          apellido: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          empresa_id: number | null
          es_calificado: string | null
          estado: string | null
          etapa_embudo: number | null
          etapa_emocional: string | null
          fecha_registro: string | null
          id: number | null
          informe_gamma: string | null
          is_active: boolean | null
          link_stripe: string | null
          metadata: Json | null
          nombre: string | null
          notas: string | null
          origen: string | null
          subscriber_id: string | null
          team_humano_id: number | null
          telefono: string | null
          timezone: string | null
          ultima_interaccion: string | null
          updated_at: string | null
          url_drive: string | null
        }
        Insert: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: number | null
          es_calificado?: string | null
          estado?: string | null
          etapa_embudo?: number | null
          etapa_emocional?: string | null
          fecha_registro?: string | null
          id?: number | null
          informe_gamma?: string | null
          is_active?: boolean | null
          link_stripe?: string | null
          metadata?: Json | null
          nombre?: string | null
          notas?: string | null
          origen?: string | null
          subscriber_id?: string | null
          team_humano_id?: number | null
          telefono?: string | null
          timezone?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
          url_drive?: string | null
        }
        Update: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: number | null
          es_calificado?: string | null
          estado?: string | null
          etapa_embudo?: number | null
          etapa_emocional?: string | null
          fecha_registro?: string | null
          id?: number | null
          informe_gamma?: string | null
          is_active?: boolean | null
          link_stripe?: string | null
          metadata?: Json | null
          nombre?: string | null
          notas?: string | null
          origen?: string | null
          subscriber_id?: string | null
          team_humano_id?: number | null
          telefono?: string | null
          timezone?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
          url_drive?: string | null
        }
        Relationships: []
      }
      test_escritura: {
        Row: {
          hora: string | null
          id: number
          id_ejecucion: number | null
          modificado: string | null
          nombre_wf: string | null
          original: string | null
        }
        Insert: {
          hora?: string | null
          id?: number
          id_ejecucion?: number | null
          modificado?: string | null
          nombre_wf?: string | null
          original?: string | null
        }
        Update: {
          hora?: string | null
          id?: number
          id_ejecucion?: number | null
          modificado?: string | null
          nombre_wf?: string | null
          original?: string | null
        }
        Relationships: []
      }
      test_respuestas_agente_evaluador: {
        Row: {
          decision_evaluador: string | null
          emrpesa: string | null
          hora: string | null
          id: number
          id_conversacion: number | null
          id_ejecucion: number | null
          input_cliente: string | null
          motivo: string | null
          nombre_agente: string | null
          output_agente: string | null
        }
        Insert: {
          decision_evaluador?: string | null
          emrpesa?: string | null
          hora?: string | null
          id?: number
          id_conversacion?: number | null
          id_ejecucion?: number | null
          input_cliente?: string | null
          motivo?: string | null
          nombre_agente?: string | null
          output_agente?: string | null
        }
        Update: {
          decision_evaluador?: string | null
          emrpesa?: string | null
          hora?: string | null
          id?: number
          id_conversacion?: number | null
          id_ejecucion?: number | null
          input_cliente?: string | null
          motivo?: string | null
          nombre_agente?: string | null
          output_agente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_respuestas_agente_evaluador_id_conversacion_fkey"
            columns: ["id_conversacion"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_respuestas_agente_evaluador_id_conversacion_fkey"
            columns: ["id_conversacion"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
        ]
      }
      training_courses: {
        Row: {
          categoria: string | null
          color_tema: string | null
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          dificultad: string | null
          duracion_estimada_min: number | null
          empresa_id: number
          id: string
          is_active: boolean | null
          is_public: boolean | null
          orden: number | null
          portada_url: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          color_tema?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          dificultad?: string | null
          duracion_estimada_min?: number | null
          empresa_id: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          orden?: number | null
          portada_url?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          color_tema?: string | null
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          dificultad?: string | null
          duracion_estimada_min?: number | null
          empresa_id?: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          orden?: number | null
          portada_url?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_courses_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      training_lessons: {
        Row: {
          contenido_intro: string | null
          course_id: string
          created_at: string | null
          id: string
          imagen_url: string | null
          is_active: boolean | null
          max_hearts: number | null
          orden: number
          tiempo_estimado_seg: number | null
          titulo: string
          updated_at: string | null
          xp_perfect_bonus: number | null
          xp_reward: number | null
        }
        Insert: {
          contenido_intro?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          imagen_url?: string | null
          is_active?: boolean | null
          max_hearts?: number | null
          orden?: number
          tiempo_estimado_seg?: number | null
          titulo: string
          updated_at?: string | null
          xp_perfect_bonus?: number | null
          xp_reward?: number | null
        }
        Update: {
          contenido_intro?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          imagen_url?: string | null
          is_active?: boolean | null
          max_hearts?: number | null
          orden?: number
          tiempo_estimado_seg?: number | null
          titulo?: string
          updated_at?: string | null
          xp_perfect_bonus?: number | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "vw_training_courses_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "vw_training_user_dashboard"
            referencedColumns: ["course_id"]
          },
        ]
      }
      training_questions: {
        Row: {
          ai_context: Json | null
          ai_generated: boolean | null
          created_at: string | null
          dificultad: number | null
          explicacion: string | null
          hint: string | null
          id: string
          is_active: boolean | null
          lesson_id: string
          opciones: Json | null
          orden: number | null
          pregunta: string
          respuesta_correcta: string
          tipo: string
        }
        Insert: {
          ai_context?: Json | null
          ai_generated?: boolean | null
          created_at?: string | null
          dificultad?: number | null
          explicacion?: string | null
          hint?: string | null
          id?: string
          is_active?: boolean | null
          lesson_id: string
          opciones?: Json | null
          orden?: number | null
          pregunta: string
          respuesta_correcta: string
          tipo: string
        }
        Update: {
          ai_context?: Json | null
          ai_generated?: boolean | null
          created_at?: string | null
          dificultad?: number | null
          explicacion?: string | null
          hint?: string | null
          id?: string
          is_active?: boolean | null
          lesson_id?: string
          opciones?: Json | null
          orden?: number | null
          pregunta?: string
          respuesta_correcta?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "training_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      training_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          freeze_count_used: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_frozen_until: string | null
          team_member_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          freeze_count_used?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_frozen_until?: string | null
          team_member_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          freeze_count_used?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_frozen_until?: string | null
          team_member_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_streaks_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: true
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "training_streaks_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: true
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      training_user_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          lesson_id: string
          local_checkpoint: Json | null
          questions_correct: number | null
          questions_total: number | null
          score: number | null
          started_at: string | null
          status: string | null
          team_member_id: number
          time_spent_sec: number | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          lesson_id: string
          local_checkpoint?: Json | null
          questions_correct?: number | null
          questions_total?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          team_member_id: number
          time_spent_sec?: number | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          lesson_id?: string
          local_checkpoint?: Json | null
          questions_correct?: number | null
          questions_total?: number | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          team_member_id?: number
          time_spent_sec?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "training_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_user_progress_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "training_user_progress_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      transcripciones: {
        Row: {
          cita_id: number | null
          created_at: string
          duracion: number | null
          grant_id: string | null
          id: number
          notetaker_id: string | null
          resumen: string | null
          resumen_cita: string | null
          reunion_id: string | null
          transcripcion: string | null
        }
        Insert: {
          cita_id?: number | null
          created_at?: string
          duracion?: number | null
          grant_id?: string | null
          id?: number
          notetaker_id?: string | null
          resumen?: string | null
          resumen_cita?: string | null
          reunion_id?: string | null
          transcripcion?: string | null
        }
        Update: {
          cita_id?: number | null
          created_at?: string
          duracion?: number | null
          grant_id?: string | null
          id?: number
          notetaker_id?: string | null
          resumen?: string | null
          resumen_cita?: string | null
          reunion_id?: string | null
          transcripcion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripciones_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_consentimientos: {
        Row: {
          anesthesia_choice: string | null
          anesthesia_risks_ack: boolean | null
          cementation_change_8days_ack: boolean | null
          cementation_satisfaction_ack: boolean | null
          delivery_delay_terms_ack: boolean | null
          diagnosis_missing_teeth: number[] | null
          diagnosis_teeth_non_restorable: number[] | null
          empresa_id: number | null
          extraction_irreversible_ack: boolean | null
          graft_type: string | null
          id: number
          id_cliente: string | null
          language: string
          metadata: string | null
          missing_required: string[] | null
          no_guarantee_ack: boolean | null
          non_refund_ack: boolean | null
          not_satisfied_notes: string | null
          patient_dob: string | null
          patient_name: string | null
          patient_responsibilities_ack: boolean | null
          planned_procedures: string[] | null
          post_care_ack: boolean | null
          preop_fasting_6h_ack: boolean | null
          punctuality_reschedule_ack: boolean | null
          session_id: string
          timestamp: string
          veneer_8days_ack: boolean | null
        }
        Insert: {
          anesthesia_choice?: string | null
          anesthesia_risks_ack?: boolean | null
          cementation_change_8days_ack?: boolean | null
          cementation_satisfaction_ack?: boolean | null
          delivery_delay_terms_ack?: boolean | null
          diagnosis_missing_teeth?: number[] | null
          diagnosis_teeth_non_restorable?: number[] | null
          empresa_id?: number | null
          extraction_irreversible_ack?: boolean | null
          graft_type?: string | null
          id?: number
          id_cliente?: string | null
          language: string
          metadata?: string | null
          missing_required?: string[] | null
          no_guarantee_ack?: boolean | null
          non_refund_ack?: boolean | null
          not_satisfied_notes?: string | null
          patient_dob?: string | null
          patient_name?: string | null
          patient_responsibilities_ack?: boolean | null
          planned_procedures?: string[] | null
          post_care_ack?: boolean | null
          preop_fasting_6h_ack?: boolean | null
          punctuality_reschedule_ack?: boolean | null
          session_id: string
          timestamp: string
          veneer_8days_ack?: boolean | null
        }
        Update: {
          anesthesia_choice?: string | null
          anesthesia_risks_ack?: boolean | null
          cementation_change_8days_ack?: boolean | null
          cementation_satisfaction_ack?: boolean | null
          delivery_delay_terms_ack?: boolean | null
          diagnosis_missing_teeth?: number[] | null
          diagnosis_teeth_non_restorable?: number[] | null
          empresa_id?: number | null
          extraction_irreversible_ack?: boolean | null
          graft_type?: string | null
          id?: number
          id_cliente?: string | null
          language?: string
          metadata?: string | null
          missing_required?: string[] | null
          no_guarantee_ack?: boolean | null
          non_refund_ack?: boolean | null
          not_satisfied_notes?: string | null
          patient_dob?: string | null
          patient_name?: string | null
          patient_responsibilities_ack?: boolean | null
          planned_procedures?: string[] | null
          post_care_ack?: boolean | null
          preop_fasting_6h_ack?: boolean | null
          punctuality_reschedule_ack?: boolean | null
          session_id?: string
          timestamp?: string
          veneer_8days_ack?: boolean | null
        }
        Relationships: []
      }
      wp_actividades_log: {
        Row: {
          accion: string
          agente_id: number | null
          contacto_id: number | null
          datos_antes: Json | null
          datos_despues: Json | null
          descripcion: string | null
          empresa_id: number | null
          entidad_id: string | null
          entidad_tipo: string | null
          fecha_creacion: string
          id: number
          ip_origen: string | null
          tipo: string
          tipo_valido: string | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          agente_id?: number | null
          contacto_id?: number | null
          datos_antes?: Json | null
          datos_despues?: Json | null
          descripcion?: string | null
          empresa_id?: number | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          fecha_creacion?: string
          id?: number
          ip_origen?: string | null
          tipo: string
          tipo_valido?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          agente_id?: number | null
          contacto_id?: number | null
          datos_antes?: Json | null
          datos_despues?: Json | null
          descripcion?: string | null
          empresa_id?: number | null
          entidad_id?: string | null
          entidad_tipo?: string | null
          fecha_creacion?: string
          id?: number
          ip_origen?: string | null
          tipo?: string
          tipo_valido?: string | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_actividades_log_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_actividades_log_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_actividades_log_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_actividades_log_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_agente_roles: {
        Row: {
          fecha_actualizacion: string
          fecha_creacion: string
          id: number
          instrucciones_rol: string | null
          nombre_rol: string | null
        }
        Insert: {
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          instrucciones_rol?: string | null
          nombre_rol?: string | null
        }
        Update: {
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          instrucciones_rol?: string | null
          nombre_rol?: string | null
        }
        Relationships: []
      }
      wp_agente_tools: {
        Row: {
          activo: boolean
          agente_id: number
          configuracion: Json | null
          fecha_actualizacion: string
          fecha_asignacion: string
          id: number
          prioridad: number | null
          tool_id: number
        }
        Insert: {
          activo?: boolean
          agente_id: number
          configuracion?: Json | null
          fecha_actualizacion?: string
          fecha_asignacion?: string
          id?: number
          prioridad?: number | null
          tool_id: number
        }
        Update: {
          activo?: boolean
          agente_id?: number
          configuracion?: Json | null
          fecha_actualizacion?: string
          fecha_asignacion?: string
          id?: number
          prioridad?: number | null
          tool_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_agente_tools_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_agente_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "wp_mcp_tools_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_agentes: {
        Row: {
          archivado: boolean | null
          areas_de_expertise: string | null
          comportamiento: string | null
          empresa_id: number | null
          fecha_actualizacion: string
          fecha_creacion: string
          formato_respuesta: string | null
          id: number
          id_rol: number | null
          idioma: string | null
          instrucciones: string | null
          instrucciones_mensajes: string | null
          instrucciones_multimedia: string | null
          llm: string | null
          manejo_herramientas: string | null
          mcp_url: string | null
          metadata_contacto: Json | null
          nombre_agente: string
          prompt_personalizado: string | null
          restricciones: string | null
          rol: string | null
          url_imagen_agente: string | null
          url_videos: string | null
          uso_de_emojis: string | null
        }
        Insert: {
          archivado?: boolean | null
          areas_de_expertise?: string | null
          comportamiento?: string | null
          empresa_id?: number | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          formato_respuesta?: string | null
          id?: number
          id_rol?: number | null
          idioma?: string | null
          instrucciones?: string | null
          instrucciones_mensajes?: string | null
          instrucciones_multimedia?: string | null
          llm?: string | null
          manejo_herramientas?: string | null
          mcp_url?: string | null
          metadata_contacto?: Json | null
          nombre_agente: string
          prompt_personalizado?: string | null
          restricciones?: string | null
          rol?: string | null
          url_imagen_agente?: string | null
          url_videos?: string | null
          uso_de_emojis?: string | null
        }
        Update: {
          archivado?: boolean | null
          areas_de_expertise?: string | null
          comportamiento?: string | null
          empresa_id?: number | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          formato_respuesta?: string | null
          id?: number
          id_rol?: number | null
          idioma?: string | null
          instrucciones?: string | null
          instrucciones_mensajes?: string | null
          instrucciones_multimedia?: string | null
          llm?: string | null
          manejo_herramientas?: string | null
          mcp_url?: string | null
          metadata_contacto?: Json | null
          nombre_agente?: string
          prompt_personalizado?: string | null
          restricciones?: string | null
          rol?: string | null
          url_imagen_agente?: string | null
          url_videos?: string | null
          uso_de_emojis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_agentes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_agentes_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "wp_agente_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_auditoria: {
        Row: {
          accion: string | null
          campo: string
          fecha: string | null
          id: number
          mensaje_commit: string | null
          registro_id: number
          tabla: string
          usuario_id: number | null
          usuario_nombre: string | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          accion?: string | null
          campo: string
          fecha?: string | null
          id?: number
          mensaje_commit?: string | null
          registro_id: number
          tabla: string
          usuario_id?: number | null
          usuario_nombre?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          accion?: string | null
          campo?: string
          fecha?: string | null
          id?: number
          mensaje_commit?: string | null
          registro_id?: number
          tabla?: string
          usuario_id?: number | null
          usuario_nombre?: string | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: []
      }
      wp_citas: {
        Row: {
          contacto_id: number | null
          created_at: string | null
          cuestionario_asesor: Json | null
          descripcion: string | null
          duracion: number | null
          duracion_buffer: number | null
          empresa_id: number | null
          estado: string | null
          evaluacion_asesor: Json | null
          event_id: string | null
          fecha_hora: string | null
          id: number
          metadata: Json | null
          notificaciones: Json | null
          preguntas_calendario: Json | null
          resumen_conversacion: string | null
          sincronizacion: string | null
          team_humano_id: number | null
          timezone_cliente: string | null
          titulo: string | null
          ubicacion: string | null
          ultima_sincronizacion: string | null
          updated_at: string | null
        }
        Insert: {
          contacto_id?: number | null
          created_at?: string | null
          cuestionario_asesor?: Json | null
          descripcion?: string | null
          duracion?: number | null
          duracion_buffer?: number | null
          empresa_id?: number | null
          estado?: string | null
          evaluacion_asesor?: Json | null
          event_id?: string | null
          fecha_hora?: string | null
          id?: number
          metadata?: Json | null
          notificaciones?: Json | null
          preguntas_calendario?: Json | null
          resumen_conversacion?: string | null
          sincronizacion?: string | null
          team_humano_id?: number | null
          timezone_cliente?: string | null
          titulo?: string | null
          ubicacion?: string | null
          ultima_sincronizacion?: string | null
          updated_at?: string | null
        }
        Update: {
          contacto_id?: number | null
          created_at?: string | null
          cuestionario_asesor?: Json | null
          descripcion?: string | null
          duracion?: number | null
          duracion_buffer?: number | null
          empresa_id?: number | null
          estado?: string | null
          evaluacion_asesor?: Json | null
          event_id?: string | null
          fecha_hora?: string | null
          id?: number
          metadata?: Json | null
          notificaciones?: Json | null
          preguntas_calendario?: Json | null
          resumen_conversacion?: string | null
          sincronizacion?: string | null
          team_humano_id?: number | null
          timezone_cliente?: string | null
          titulo?: string | null
          ubicacion?: string | null
          ultima_sincronizacion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_citas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_citas_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_citas_participantes: {
        Row: {
          added_by: string | null
          cita_id: number
          created_at: string | null
          email: string | null
          estado_rsvp: string | null
          id: number
          rol: string
          team_humano_id: number
        }
        Insert: {
          added_by?: string | null
          cita_id: number
          created_at?: string | null
          email?: string | null
          estado_rsvp?: string | null
          id?: number
          rol?: string
          team_humano_id: number
        }
        Update: {
          added_by?: string | null
          cita_id?: number
          created_at?: string | null
          email?: string | null
          estado_rsvp?: string | null
          id?: number
          rol?: string
          team_humano_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_citas_participantes_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_participantes_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_citas_participantes_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_contacto_estado_embudo: {
        Row: {
          contacto_id: number
          empresa_id: number
          etapa_actual: number
          etapa_anterior: number | null
          fecha_ingreso_embudo: string
          fecha_ultimo_cambio: string
          id: number
          metadata: Json | null
          notas: string | null
          origen_cambio: string | null
          team_humano_id: number | null
        }
        Insert: {
          contacto_id: number
          empresa_id: number
          etapa_actual: number
          etapa_anterior?: number | null
          fecha_ingreso_embudo?: string
          fecha_ultimo_cambio?: string
          id?: number
          metadata?: Json | null
          notas?: string | null
          origen_cambio?: string | null
          team_humano_id?: number | null
        }
        Update: {
          contacto_id?: number
          empresa_id?: number
          etapa_actual?: number
          etapa_anterior?: number | null
          fecha_ingreso_embudo?: string
          fecha_ultimo_cambio?: string
          id?: number
          metadata?: Json | null
          notas?: string | null
          origen_cambio?: string | null
          team_humano_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_contacto_estado_embudo_contacto_fkey"
            columns: ["contacto_id"]
            isOneToOne: true
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_contacto_fkey"
            columns: ["contacto_id"]
            isOneToOne: true
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_empresa_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_etapa_actual_fkey"
            columns: ["etapa_actual"]
            isOneToOne: false
            referencedRelation: "wp_empresa_embudo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_etapa_anterior_fkey"
            columns: ["etapa_anterior"]
            isOneToOne: false
            referencedRelation: "wp_empresa_embudo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_team_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contacto_estado_embudo_team_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_contacto_team_asignaciones: {
        Row: {
          asignado_por: number | null
          contacto_id: number
          created_at: string | null
          empresa_id: number
          es_principal: boolean | null
          id: number
          rol_asignacion: string | null
          team_humano_id: number
          updated_at: string | null
        }
        Insert: {
          asignado_por?: number | null
          contacto_id: number
          created_at?: string | null
          empresa_id: number
          es_principal?: boolean | null
          id?: number
          rol_asignacion?: string | null
          team_humano_id: number
          updated_at?: string | null
        }
        Update: {
          asignado_por?: number | null
          contacto_id?: number
          created_at?: string | null
          empresa_id?: number
          es_principal?: boolean | null
          id?: number
          rol_asignacion?: string | null
          team_humano_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_contacto_team_asignaciones_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contacto_team_asignaciones_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_contactos: {
        Row: {
          apellido: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          empresa_id: number | null
          es_calificado: string | null
          estado: string | null
          etapa_embudo: number | null
          etapa_emocional: string | null
          fecha_registro: string
          id: number
          informe_gamma: string | null
          is_active: boolean | null
          link_stripe: string | null
          metadata: Json | null
          nombre: string | null
          notas: string | null
          origen: string | null
          paused_until: string | null
          subscriber_id: string | null
          suscripcion: boolean | null
          team_humano_id: number | null
          telefono: string | null
          timezone: string | null
          ultima_interaccion: string | null
          updated_at: string | null
          url_drive: string | null
        }
        Insert: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: number | null
          es_calificado?: string | null
          estado?: string | null
          etapa_embudo?: number | null
          etapa_emocional?: string | null
          fecha_registro?: string
          id?: number
          informe_gamma?: string | null
          is_active?: boolean | null
          link_stripe?: string | null
          metadata?: Json | null
          nombre?: string | null
          notas?: string | null
          origen?: string | null
          paused_until?: string | null
          subscriber_id?: string | null
          suscripcion?: boolean | null
          team_humano_id?: number | null
          telefono?: string | null
          timezone?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
          url_drive?: string | null
        }
        Update: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: number | null
          es_calificado?: string | null
          estado?: string | null
          etapa_embudo?: number | null
          etapa_emocional?: string | null
          fecha_registro?: string
          id?: number
          informe_gamma?: string | null
          is_active?: boolean | null
          link_stripe?: string | null
          metadata?: Json | null
          nombre?: string | null
          notas?: string | null
          origen?: string | null
          paused_until?: string | null
          subscriber_id?: string | null
          suscripcion?: boolean | null
          team_humano_id?: number | null
          telefono?: string | null
          timezone?: string | null
          ultima_interaccion?: string | null
          updated_at?: string | null
          url_drive?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_contactos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_etapa_embudo_fkey"
            columns: ["etapa_embudo"]
            isOneToOne: false
            referencedRelation: "wp_empresa_embudo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contactos_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_contactos_auditoria: {
        Row: {
          accion: string
          canal_comunicacion: string | null
          contacto_id: number
          creado_en: string | null
          empresa_id: number | null
          id: number
          mensaje: string | null
          resultado: string
          telefono_nuevo: string | null
          telefono_viejo: string | null
        }
        Insert: {
          accion: string
          canal_comunicacion?: string | null
          contacto_id: number
          creado_en?: string | null
          empresa_id?: number | null
          id?: number
          mensaje?: string | null
          resultado: string
          telefono_nuevo?: string | null
          telefono_viejo?: string | null
        }
        Update: {
          accion?: string
          canal_comunicacion?: string | null
          contacto_id?: number
          creado_en?: string | null
          empresa_id?: number | null
          id?: number
          mensaje?: string | null
          resultado?: string
          telefono_nuevo?: string | null
          telefono_viejo?: string | null
        }
        Relationships: []
      }
      wp_contactos_merge_log: {
        Row: {
          empresa_id: number
          field_choices: Json
          id: number
          merged_at: string
          merged_by: number | null
          primary_contact_id: number
          secondary_contact_id: number
          secondary_snapshot: Json
          tables_updated: Json
        }
        Insert: {
          empresa_id: number
          field_choices?: Json
          id?: never
          merged_at?: string
          merged_by?: number | null
          primary_contact_id: number
          secondary_contact_id: number
          secondary_snapshot: Json
          tables_updated?: Json
        }
        Update: {
          empresa_id?: number
          field_choices?: Json
          id?: never
          merged_at?: string
          merged_by?: number | null
          primary_contact_id?: number
          secondary_contact_id?: number
          secondary_snapshot?: Json
          tables_updated?: Json
        }
        Relationships: [
          {
            foreignKeyName: "wp_contactos_merge_log_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_merge_log_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contactos_merge_log_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_contactos_nota: {
        Row: {
          archivos_urls: string[] | null
          contacto_id: number | null
          created_at: string
          descripcion: string | null
          es_fijado: boolean | null
          etiquetas: Json | null
          id: number
          team_humano_id: number | null
          titulo: string | null
          visible_ia: boolean | null
        }
        Insert: {
          archivos_urls?: string[] | null
          contacto_id?: number | null
          created_at?: string
          descripcion?: string | null
          es_fijado?: boolean | null
          etiquetas?: Json | null
          id?: number
          team_humano_id?: number | null
          titulo?: string | null
          visible_ia?: boolean | null
        }
        Update: {
          archivos_urls?: string[] | null
          contacto_id?: number | null
          created_at?: string
          descripcion?: string | null
          es_fijado?: boolean | null
          etiquetas?: Json | null
          id?: number
          team_humano_id?: number | null
          titulo?: string | null
          visible_ia?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_contactos_nota_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_nota_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_nota_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contactos_nota_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_conversaciones: {
        Row: {
          agente_id: number | null
          canal: string
          contacto_id: number
          created_at: string
          empresa_id: number | null
          evaluacion: number | null
          fecha_analisis: string | null
          fecha_inicio: string
          fecha_ultimo_mensaje_usuario: string | null
          id: number
          inteligencia_conversacional: string | null
          metadata: Json | null
          numero_id: number | null
          resumen: string | null
          seguimiento: string | null
          subscriber_id_redes: string | null
          ultimo_mensaje_at: string | null
          ultimo_mensaje_contenido: string | null
          ultimo_mensaje_remitente: string | null
          updated_at: string
        }
        Insert: {
          agente_id?: number | null
          canal: string
          contacto_id: number
          created_at?: string
          empresa_id?: number | null
          evaluacion?: number | null
          fecha_analisis?: string | null
          fecha_inicio?: string
          fecha_ultimo_mensaje_usuario?: string | null
          id?: number
          inteligencia_conversacional?: string | null
          metadata?: Json | null
          numero_id?: number | null
          resumen?: string | null
          seguimiento?: string | null
          subscriber_id_redes?: string | null
          ultimo_mensaje_at?: string | null
          ultimo_mensaje_contenido?: string | null
          ultimo_mensaje_remitente?: string | null
          updated_at?: string
        }
        Update: {
          agente_id?: number | null
          canal?: string
          contacto_id?: number
          created_at?: string
          empresa_id?: number | null
          evaluacion?: number | null
          fecha_analisis?: string | null
          fecha_inicio?: string
          fecha_ultimo_mensaje_usuario?: string | null
          id?: number
          inteligencia_conversacional?: string | null
          metadata?: Json | null
          numero_id?: number | null
          resumen?: string | null
          seguimiento?: string | null
          subscriber_id_redes?: string | null
          ultimo_mensaje_at?: string | null
          ultimo_mensaje_contenido?: string | null
          ultimo_mensaje_remitente?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_conversaciones_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: false
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_crm_pagos: {
        Row: {
          archivado_at: string | null
          archivado_por: number | null
          comprobante_url: string | null
          contacto_id: number
          created_at: string | null
          empresa_id: number
          estado: string | null
          factura_id: number | null
          fecha_pago: string | null
          id: number
          metadata: Json | null
          metodo_pago: string | null
          moneda: string | null
          monto: number
          nota: string | null
          referencia: string | null
          registrado_por: number | null
          servicio_id: number
          updated_at: string | null
        }
        Insert: {
          archivado_at?: string | null
          archivado_por?: number | null
          comprobante_url?: string | null
          contacto_id: number
          created_at?: string | null
          empresa_id: number
          estado?: string | null
          factura_id?: number | null
          fecha_pago?: string | null
          id?: number
          metadata?: Json | null
          metodo_pago?: string | null
          moneda?: string | null
          monto: number
          nota?: string | null
          referencia?: string | null
          registrado_por?: number | null
          servicio_id: number
          updated_at?: string | null
        }
        Update: {
          archivado_at?: string | null
          archivado_por?: number | null
          comprobante_url?: string | null
          contacto_id?: number
          created_at?: string | null
          empresa_id?: number
          estado?: string | null
          factura_id?: number | null
          fecha_pago?: string | null
          id?: number
          metadata?: Json | null
          metodo_pago?: string | null
          moneda?: string | null
          monto?: number
          nota?: string | null
          referencia?: string | null
          registrado_por?: number | null
          servicio_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pagos_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_factura"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "vw_facturas_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_factura"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "wp_facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_registrador"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "fk_pagos_registrador"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pagos_servicio"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_crm_pagos_archivado_por_fkey"
            columns: ["archivado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_crm_pagos_archivado_por_fkey"
            columns: ["archivado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_crm_servicios: {
        Row: {
          archivado_at: string | null
          archivado_por: number | null
          contacto_id: number
          contrato_url: string | null
          created_at: string | null
          created_by: number | null
          cuota_mensual: number | null
          descripcion: string | null
          dia_compromiso_pago: number | null
          empresa_id: number
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: number
          metadata: Json | null
          moneda: string | null
          nombre_servicio: string
          saldo_pagado: number
          saldo_pendiente: number | null
          tipo_servicio: string | null
          ultima_factura_id: number | null
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          archivado_at?: string | null
          archivado_por?: number | null
          contacto_id: number
          contrato_url?: string | null
          created_at?: string | null
          created_by?: number | null
          cuota_mensual?: number | null
          descripcion?: string | null
          dia_compromiso_pago?: number | null
          empresa_id: number
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          metadata?: Json | null
          moneda?: string | null
          nombre_servicio: string
          saldo_pagado?: number
          saldo_pendiente?: number | null
          tipo_servicio?: string | null
          ultima_factura_id?: number | null
          updated_at?: string | null
          valor_total?: number
        }
        Update: {
          archivado_at?: string | null
          archivado_por?: number | null
          contacto_id?: number
          contrato_url?: string | null
          created_at?: string | null
          created_by?: number | null
          cuota_mensual?: number | null
          descripcion?: string | null
          dia_compromiso_pago?: number | null
          empresa_id?: number
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          metadata?: Json | null
          moneda?: string | null
          nombre_servicio?: string
          saldo_pagado?: number
          saldo_pendiente?: number | null
          tipo_servicio?: string | null
          ultima_factura_id?: number | null
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_servicios_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_servicios_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_servicios_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_servicios_ultima_factura"
            columns: ["ultima_factura_id"]
            isOneToOne: false
            referencedRelation: "vw_facturas_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_servicios_ultima_factura"
            columns: ["ultima_factura_id"]
            isOneToOne: false
            referencedRelation: "wp_facturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_crm_servicios_archivado_por_fkey"
            columns: ["archivado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_crm_servicios_archivado_por_fkey"
            columns: ["archivado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_deep_research: {
        Row: {
          artifact_id: string | null
          completed_at: string | null
          created_at: string | null
          credits_used: number | null
          data: Json | null
          empresa_id: number | null
          error: string | null
          expires_at: string | null
          firecrawl_job_id: string | null
          id: string
          local_job_id: string
          prompt: string
          schema: Json | null
          started_at: string | null
          status: string
          updated_at: string | null
          urls: string[] | null
          user_id: string
        }
        Insert: {
          artifact_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          credits_used?: number | null
          data?: Json | null
          empresa_id?: number | null
          error?: string | null
          expires_at?: string | null
          firecrawl_job_id?: string | null
          id?: string
          local_job_id: string
          prompt: string
          schema?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          urls?: string[] | null
          user_id: string
        }
        Update: {
          artifact_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          credits_used?: number | null
          data?: Json | null
          empresa_id?: number | null
          error?: string | null
          expires_at?: string | null
          firecrawl_job_id?: string | null
          id?: string
          local_job_id?: string
          prompt?: string
          schema?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          urls?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_deep_research_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifacts"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_documentacion: {
        Row: {
          clave: string
          descripcion_corta: string
          descripcion_larga: string | null
          ejemplos_uso: Json | null
          fecha_actualizacion: string
          fecha_creacion: string
          id: number
          tags: Json | null
          tipo: string
          titulo: string
        }
        Insert: {
          clave: string
          descripcion_corta: string
          descripcion_larga?: string | null
          ejemplos_uso?: Json | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          tags?: Json | null
          tipo: string
          titulo: string
        }
        Update: {
          clave?: string
          descripcion_corta?: string
          descripcion_larga?: string | null
          ejemplos_uso?: Json | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          tags?: Json | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      wp_email_campanas: {
        Row: {
          audiencia_id: number | null
          cadencia_dias: number
          created_at: string
          descripcion: string | null
          empresa_id: number | null
          es_default_post_conversacion: boolean | null
          estado: string
          id: number
          instrucciones_ai: string | null
          metadata: Json | null
          nombre: string
          total_toques: number | null
          updated_at: string
        }
        Insert: {
          audiencia_id?: number | null
          cadencia_dias?: number
          created_at?: string
          descripcion?: string | null
          empresa_id?: number | null
          es_default_post_conversacion?: boolean | null
          estado?: string
          id?: number
          instrucciones_ai?: string | null
          metadata?: Json | null
          nombre: string
          total_toques?: number | null
          updated_at?: string
        }
        Update: {
          audiencia_id?: number | null
          cadencia_dias?: number
          created_at?: string
          descripcion?: string | null
          empresa_id?: number | null
          es_default_post_conversacion?: boolean | null
          estado?: string
          id?: number
          instrucciones_ai?: string | null
          metadata?: Json | null
          nombre?: string
          total_toques?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_email_campanas_audiencia_id_fkey"
            columns: ["audiencia_id"]
            isOneToOne: false
            referencedRelation: "wp_marketing_audiencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_campanas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_email_contacto_campana: {
        Row: {
          campana_id: number
          condiciones_entrada_capturadas: Json | null
          contacto_id: number
          created_at: string
          empresa_id: number
          estado: string
          fecha_inscripcion: string
          fecha_salida: string | null
          id: number
          metadata: Json | null
          motivo_salida: string | null
          proximo_envio_en: string | null
          ultimo_toque: number
          updated_at: string
        }
        Insert: {
          campana_id: number
          condiciones_entrada_capturadas?: Json | null
          contacto_id: number
          created_at?: string
          empresa_id: number
          estado?: string
          fecha_inscripcion?: string
          fecha_salida?: string | null
          id?: number
          metadata?: Json | null
          motivo_salida?: string | null
          proximo_envio_en?: string | null
          ultimo_toque?: number
          updated_at?: string
        }
        Update: {
          campana_id?: number
          condiciones_entrada_capturadas?: Json | null
          contacto_id?: number
          created_at?: string
          empresa_id?: number
          estado?: string
          fecha_inscripcion?: string
          fecha_salida?: string | null
          id?: number
          metadata?: Json | null
          motivo_salida?: string | null
          proximo_envio_en?: string | null
          ultimo_toque?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_email_contacto_campana_campana_id_fkey"
            columns: ["campana_id"]
            isOneToOne: false
            referencedRelation: "wp_email_campanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_contacto_campana_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_contacto_campana_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_contacto_campana_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_email_envio: {
        Row: {
          abierto_en: string | null
          asunto: string | null
          campana_id: number | null
          contacto_id: number
          created_at: string
          cuerpo_html: string | null
          cuerpo_texto: string | null
          email_id: string | null
          enviado_en: string | null
          estado: string
          id: number
          metadata: Json | null
          remitente_team_humano: number | null
          secuencia: number
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          abierto_en?: string | null
          asunto?: string | null
          campana_id?: number | null
          contacto_id: number
          created_at?: string
          cuerpo_html?: string | null
          cuerpo_texto?: string | null
          email_id?: string | null
          enviado_en?: string | null
          estado?: string
          id?: number
          metadata?: Json | null
          remitente_team_humano?: number | null
          secuencia?: number
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          abierto_en?: string | null
          asunto?: string | null
          campana_id?: number | null
          contacto_id?: number
          created_at?: string
          cuerpo_html?: string | null
          cuerpo_texto?: string | null
          email_id?: string | null
          enviado_en?: string | null
          estado?: string
          id?: number
          metadata?: Json | null
          remitente_team_humano?: number | null
          secuencia?: number
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_email_envio_campana_id_fkey"
            columns: ["campana_id"]
            isOneToOne: false
            referencedRelation: "wp_email_campanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_envio_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_envio_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_envio_remitente_team_humano_fkey"
            columns: ["remitente_team_humano"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_email_envio_remitente_team_humano_fkey"
            columns: ["remitente_team_humano"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_email_recibido: {
        Row: {
          asunto: string | null
          contacto_id: number
          contestar: boolean | null
          created_at: string
          cuerpo_html: string | null
          cuerpo_texto: string | null
          descripcion: string | null
          email_id: string | null
          empresa_id: number
          id: number
          receptor_team_humano: number | null
          recibido_en: string
          thread_id: string | null
          tipo: string | null
        }
        Insert: {
          asunto?: string | null
          contacto_id: number
          contestar?: boolean | null
          created_at?: string
          cuerpo_html?: string | null
          cuerpo_texto?: string | null
          descripcion?: string | null
          email_id?: string | null
          empresa_id: number
          id?: number
          receptor_team_humano?: number | null
          recibido_en?: string
          thread_id?: string | null
          tipo?: string | null
        }
        Update: {
          asunto?: string | null
          contacto_id?: number
          contestar?: boolean | null
          created_at?: string
          cuerpo_html?: string | null
          cuerpo_texto?: string | null
          descripcion?: string | null
          email_id?: string | null
          empresa_id?: number
          id?: number
          receptor_team_humano?: number | null
          recibido_en?: string
          thread_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_email_recibido_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_recibido_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_recibido_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_email_recibido_receptor_team_humano_fkey"
            columns: ["receptor_team_humano"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_email_recibido_receptor_team_humano_fkey"
            columns: ["receptor_team_humano"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_empresa_ads_config: {
        Row: {
          campos_activos: string[] | null
          connector: string
          created_at: string | null
          created_by: number | null
          empresa_id: number
          id: number
          is_active: boolean | null
          metadata: Json | null
          updated_at: string | null
          windsor_token: string | null
        }
        Insert: {
          campos_activos?: string[] | null
          connector: string
          created_at?: string | null
          created_by?: number | null
          empresa_id: number
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string | null
          windsor_token?: string | null
        }
        Update: {
          campos_activos?: string[] | null
          connector?: string
          created_at?: string | null
          created_by?: number | null
          empresa_id?: number
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          updated_at?: string | null
          windsor_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_empresa_ads_config_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_empresa_ads_config_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_empresa_ads_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_empresa_embudo: {
        Row: {
          configuracion_seguimiento: Json | null
          descripcion: Json | null
          empresa_id: number
          fecha_actualizacion: string
          fecha_creacion: string
          id: number
          nombre_etapa: string
          orden_etapa: number
          Respaldo: Json | null
        }
        Insert: {
          configuracion_seguimiento?: Json | null
          descripcion?: Json | null
          empresa_id: number
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          nombre_etapa: string
          orden_etapa: number
          Respaldo?: Json | null
        }
        Update: {
          configuracion_seguimiento?: Json | null
          descripcion?: Json | null
          empresa_id?: number
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          nombre_etapa?: string
          orden_etapa?: number
          Respaldo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_empresa_embudo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_empresa_historial: {
        Row: {
          campo: string
          created_at: string | null
          empresa_id: number
          id: number
          mensaje_commit: string | null
          usuario_id: number | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          campo: string
          created_at?: string | null
          empresa_id: number
          id?: number
          mensaje_commit?: string | null
          usuario_id?: number | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          campo?: string
          created_at?: string | null
          empresa_id?: number
          id?: number
          mensaje_commit?: string | null
          usuario_id?: number | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_empresa_historial_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_empresa_historial_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_empresa_historial_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_empresa_perfil: {
        Row: {
          activo: boolean | null
          branding: Json | null
          canal_comunicacion: string | null
          ciudad: string | null
          direccion: string | null
          email: string | null
          email_marketing: boolean | null
          embudo_ventas: string | null
          fecha_actualizacion: string
          fecha_creacion: string
          id: number
          informacion_empresarial: string | null
          logo_url: string | null
          metadata: Json | null
          metricas_activa: boolean | null
          nombre: string
          pais: string | null
          preguntas_frecuentes: string | null
          reglas_negocio: string | null
          rubro: string | null
          servicios_generales: string | null
          sitio_web: string | null
          team_slack: string | null
          telefono: string | null
          timezone: string | null
        }
        Insert: {
          activo?: boolean | null
          branding?: Json | null
          canal_comunicacion?: string | null
          ciudad?: string | null
          direccion?: string | null
          email?: string | null
          email_marketing?: boolean | null
          embudo_ventas?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          informacion_empresarial?: string | null
          logo_url?: string | null
          metadata?: Json | null
          metricas_activa?: boolean | null
          nombre: string
          pais?: string | null
          preguntas_frecuentes?: string | null
          reglas_negocio?: string | null
          rubro?: string | null
          servicios_generales?: string | null
          sitio_web?: string | null
          team_slack?: string | null
          telefono?: string | null
          timezone?: string | null
        }
        Update: {
          activo?: boolean | null
          branding?: Json | null
          canal_comunicacion?: string | null
          ciudad?: string | null
          direccion?: string | null
          email?: string | null
          email_marketing?: boolean | null
          embudo_ventas?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          informacion_empresarial?: string | null
          logo_url?: string | null
          metadata?: Json | null
          metricas_activa?: boolean | null
          nombre?: string
          pais?: string | null
          preguntas_frecuentes?: string | null
          reglas_negocio?: string | null
          rubro?: string | null
          servicios_generales?: string | null
          sitio_web?: string | null
          team_slack?: string | null
          telefono?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      wp_error_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          empresa_id: number | null
          error_message: string | null
          error_stack: string | null
          function_name: string
          id: number
          request_body: string | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          empresa_id?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name: string
          id?: number
          request_body?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          empresa_id?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name?: string
          id?: number
          request_body?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wp_etiquetas_equipo: {
        Row: {
          color: string | null
          created_at: string | null
          descripcion: string | null
          empresa_id: number
          id: number
          nombre: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id: number
          id?: number
          nombre: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_etiquetas_equipo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_evaluacion_preliminar: {
        Row: {
          categoria: string | null
          codigo_criterio: string
          contacto_id: number
          created_at: string | null
          cumple: boolean
          descripcion: string
          evaluacion_completa: Json | null
          evidencias: string[] | null
          fecha_evaluacion: string | null
          icono: string | null
          id: number
          informacion_faltante: string[] | null
          nivel_confianza: string | null
          observaciones: string | null
          oportunidades_crecimiento: Json | null
          ponderacion: number
          porcentaje_obtenido: number | null
          recomendaciones: string[] | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          codigo_criterio: string
          contacto_id: number
          created_at?: string | null
          cumple?: boolean
          descripcion: string
          evaluacion_completa?: Json | null
          evidencias?: string[] | null
          fecha_evaluacion?: string | null
          icono?: string | null
          id?: number
          informacion_faltante?: string[] | null
          nivel_confianza?: string | null
          observaciones?: string | null
          oportunidades_crecimiento?: Json | null
          ponderacion: number
          porcentaje_obtenido?: number | null
          recomendaciones?: string[] | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          codigo_criterio?: string
          contacto_id?: number
          created_at?: string | null
          cumple?: boolean
          descripcion?: string
          evaluacion_completa?: Json | null
          evidencias?: string[] | null
          fecha_evaluacion?: string | null
          icono?: string | null
          id?: number
          informacion_faltante?: string[] | null
          nivel_confianza?: string | null
          observaciones?: string | null
          oportunidades_crecimiento?: Json | null
          ponderacion?: number
          porcentaje_obtenido?: number | null
          recomendaciones?: string[] | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_evaluacion_preliminar_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_evaluacion_preliminar_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_facturas: {
        Row: {
          cliente_direccion: string | null
          cliente_documento: string | null
          cliente_email: string | null
          cliente_nombre: string
          cliente_pais: string | null
          cliente_telefono: string | null
          contacto_id: number
          created_at: string | null
          created_by: number | null
          descuentos: number | null
          empresa_direccion: string | null
          empresa_documento: string | null
          empresa_email: string | null
          empresa_id: number
          empresa_logo_url: string | null
          empresa_nombre: string
          empresa_sitio_web: string | null
          empresa_telefono: string | null
          estado: string | null
          fecha_emision: string | null
          fecha_vencimiento: string | null
          id: number
          impuestos: number | null
          items: Json
          metadata: Json | null
          moneda: string | null
          monto_pagado: number | null
          notas: string | null
          numero_factura: string
          pago_id: number | null
          pdf_url: string | null
          prefijo: string | null
          saldo_pendiente: number | null
          secuencia: number
          servicio_id: number | null
          subtotal: number
          terminos: string | null
          total: number
          updated_at: string | null
        }
        Insert: {
          cliente_direccion?: string | null
          cliente_documento?: string | null
          cliente_email?: string | null
          cliente_nombre: string
          cliente_pais?: string | null
          cliente_telefono?: string | null
          contacto_id: number
          created_at?: string | null
          created_by?: number | null
          descuentos?: number | null
          empresa_direccion?: string | null
          empresa_documento?: string | null
          empresa_email?: string | null
          empresa_id: number
          empresa_logo_url?: string | null
          empresa_nombre: string
          empresa_sitio_web?: string | null
          empresa_telefono?: string | null
          estado?: string | null
          fecha_emision?: string | null
          fecha_vencimiento?: string | null
          id?: number
          impuestos?: number | null
          items?: Json
          metadata?: Json | null
          moneda?: string | null
          monto_pagado?: number | null
          notas?: string | null
          numero_factura: string
          pago_id?: number | null
          pdf_url?: string | null
          prefijo?: string | null
          saldo_pendiente?: number | null
          secuencia: number
          servicio_id?: number | null
          subtotal?: number
          terminos?: string | null
          total?: number
          updated_at?: string | null
        }
        Update: {
          cliente_direccion?: string | null
          cliente_documento?: string | null
          cliente_email?: string | null
          cliente_nombre?: string
          cliente_pais?: string | null
          cliente_telefono?: string | null
          contacto_id?: number
          created_at?: string | null
          created_by?: number | null
          descuentos?: number | null
          empresa_direccion?: string | null
          empresa_documento?: string | null
          empresa_email?: string | null
          empresa_id?: number
          empresa_logo_url?: string | null
          empresa_nombre?: string
          empresa_sitio_web?: string | null
          empresa_telefono?: string | null
          estado?: string | null
          fecha_emision?: string | null
          fecha_vencimiento?: string | null
          id?: number
          impuestos?: number | null
          items?: Json
          metadata?: Json | null
          moneda?: string | null
          monto_pagado?: number | null
          notas?: string | null
          numero_factura?: string
          pago_id?: number | null
          pdf_url?: string | null
          prefijo?: string | null
          saldo_pendiente?: number | null
          secuencia?: number
          servicio_id?: number | null
          subtotal?: number
          terminos?: string | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_facturas_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_pago"
            columns: ["pago_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_pagos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_servicio"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_finanzas: {
        Row: {
          categoria: string | null
          concepto: string
          contacto_id: number | null
          created_at: string | null
          descripcion: string | null
          empresa_id: number | null
          estado: Database["public"]["Enums"]["finanza_estado"] | null
          fecha: string | null
          fecha_vencimiento: string | null
          id: string
          metadata: Json | null
          metodo_pago: string | null
          monto: number
          notas: string | null
          referencia: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          subcategoria: string | null
          tipo: Database["public"]["Enums"]["finanza_tipo"]
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          concepto: string
          contacto_id?: number | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["finanza_estado"] | null
          fecha?: string | null
          fecha_vencimiento?: string | null
          id?: string
          metadata?: Json | null
          metodo_pago?: string | null
          monto: number
          notas?: string | null
          referencia?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          subcategoria?: string | null
          tipo: Database["public"]["Enums"]["finanza_tipo"]
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          concepto?: string
          contacto_id?: number | null
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["finanza_estado"] | null
          fecha?: string | null
          fecha_vencimiento?: string | null
          id?: string
          metadata?: Json | null
          metodo_pago?: string | null
          monto?: number
          notas?: string | null
          referencia?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          subcategoria?: string | null
          tipo?: Database["public"]["Enums"]["finanza_tipo"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_finanzas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_finanzas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_finanzas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_follow_up: {
        Row: {
          canal: string | null
          created_at: string
          id: number
          intento: string | null
          mensaje: string | null
          tipo: string | null
        }
        Insert: {
          canal?: string | null
          created_at?: string
          id?: number
          intento?: string | null
          mensaje?: string | null
          tipo?: string | null
        }
        Update: {
          canal?: string | null
          created_at?: string
          id?: number
          intento?: string | null
          mensaje?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      wp_marketing_audiencia_contacto: {
        Row: {
          audiencia_id: number
          contacto_id: number
          created_at: string | null
          id: number
        }
        Insert: {
          audiencia_id: number
          contacto_id: number
          created_at?: string | null
          id?: number
        }
        Update: {
          audiencia_id?: number
          contacto_id?: number
          created_at?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_marketing_audiencia_contacto_audiencia_id_fkey"
            columns: ["audiencia_id"]
            isOneToOne: false
            referencedRelation: "wp_marketing_audiencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_marketing_audiencia_contacto_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_marketing_audiencia_contacto_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_marketing_audiencias: {
        Row: {
          created_at: string | null
          descripcion: string | null
          empresa_id: number
          filtros_json: Json | null
          id: number
          metadata: Json | null
          nombre: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          empresa_id: number
          filtros_json?: Json | null
          id?: number
          metadata?: Json | null
          nombre: string
          tipo?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number
          filtros_json?: Json | null
          id?: number
          metadata?: Json | null
          nombre?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_marketing_audiencias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_mcp_tools_catalog: {
        Row: {
          activo: boolean
          categoria: string | null
          descripcion: string
          empresa_id: number | null
          endpoint: string | null
          fecha_actualizacion: string
          fecha_creacion: string
          id: number
          metadata: Json | null
          nombre_tool: string
          permisos: Json | null
          schema: Json
          secreto: string | null
          version: string | null
        }
        Insert: {
          activo?: boolean
          categoria?: string | null
          descripcion: string
          empresa_id?: number | null
          endpoint?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          metadata?: Json | null
          nombre_tool: string
          permisos?: Json | null
          schema: Json
          secreto?: string | null
          version?: string | null
        }
        Update: {
          activo?: boolean
          categoria?: string | null
          descripcion?: string
          empresa_id?: number | null
          endpoint?: string | null
          fecha_actualizacion?: string
          fecha_creacion?: string
          id?: number
          metadata?: Json | null
          nombre_tool?: string
          permisos?: Json | null
          schema?: Json
          secreto?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_mcp_tools_catalog_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_mensajes: {
        Row: {
          contenido: string
          conversacion_id: number
          created_at: string
          empresa_id: number | null
          id: number
          id_externo: string | null
          metadata: Json | null
          modelo_llm: string | null
          remitente: string
          status: string | null
          timestamp: string
          tipo: string
          updated_at: string
          url_ejecucion: string | null
          uso_herramientas: Json | null
        }
        Insert: {
          contenido: string
          conversacion_id: number
          created_at?: string
          empresa_id?: number | null
          id?: number
          id_externo?: string | null
          metadata?: Json | null
          modelo_llm?: string | null
          remitente: string
          status?: string | null
          timestamp?: string
          tipo?: string
          updated_at?: string
          url_ejecucion?: string | null
          uso_herramientas?: Json | null
        }
        Update: {
          contenido?: string
          conversacion_id?: number
          created_at?: string
          empresa_id?: number | null
          id?: number
          id_externo?: string | null
          metadata?: Json | null
          modelo_llm?: string | null
          remitente?: string
          status?: string | null
          timestamp?: string
          tipo?: string
          updated_at?: string
          url_ejecucion?: string | null
          uso_herramientas?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_mensajes_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "wp_conversaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_metodos_pago: {
        Row: {
          codigo: string
          created_at: string | null
          created_by: number | null
          descripcion: string | null
          empresa_id: number
          icono: string | null
          id: number
          is_active: boolean | null
          metadata: Json | null
          nombre: string
          orden: number | null
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          empresa_id: number
          icono?: string | null
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          nombre: string
          orden?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          empresa_id?: number
          icono?: string | null
          id?: number
          is_active?: boolean | null
          metadata?: Json | null
          nombre?: string
          orden?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_metodos_pago_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_module_usage_daily: {
        Row: {
          avg_time_seconds: number | null
          created_at: string | null
          date: string
          empresa_id: number | null
          id: number
          module: string
          total_actions: number | null
          total_views: number | null
          unique_users: number | null
        }
        Insert: {
          avg_time_seconds?: number | null
          created_at?: string | null
          date: string
          empresa_id?: number | null
          id?: number
          module: string
          total_actions?: number | null
          total_views?: number | null
          unique_users?: number | null
        }
        Update: {
          avg_time_seconds?: number | null
          created_at?: string | null
          date?: string
          empresa_id?: number | null
          id?: number
          module?: string
          total_actions?: number | null
          total_views?: number | null
          unique_users?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_module_usage_daily_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_multimedia: {
        Row: {
          archivo_url: string
          contacto_id: number | null
          contenido: Json | null
          created_at: string
          empresa_id: number | null
          estado: string | null
          hash: string | null
          id: number
          metadata: Json | null
          nombre_archivo: string | null
          seccion: string | null
          tamaño: number | null
          tipo: string
          updated_at: string
          url_carpeta: string | null
        }
        Insert: {
          archivo_url: string
          contacto_id?: number | null
          contenido?: Json | null
          created_at?: string
          empresa_id?: number | null
          estado?: string | null
          hash?: string | null
          id?: number
          metadata?: Json | null
          nombre_archivo?: string | null
          seccion?: string | null
          tamaño?: number | null
          tipo: string
          updated_at?: string
          url_carpeta?: string | null
        }
        Update: {
          archivo_url?: string
          contacto_id?: number | null
          contenido?: Json | null
          created_at?: string
          empresa_id?: number | null
          estado?: string | null
          hash?: string | null
          id?: number
          metadata?: Json | null
          nombre_archivo?: string | null
          seccion?: string | null
          tamaño?: number | null
          tipo?: string
          updated_at?: string
          url_carpeta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_multimedia_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_multimedia_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_notificaciones: {
        Row: {
          contacto_id: number | null
          id: number
          mensaje: string
          metadata: Json | null
          team_humano: number | null
          tipo: string
          titulo: string
        }
        Insert: {
          contacto_id?: number | null
          id?: number
          mensaje: string
          metadata?: Json | null
          team_humano?: number | null
          tipo: string
          titulo: string
        }
        Update: {
          contacto_id?: number | null
          id?: number
          mensaje?: string
          metadata?: Json | null
          team_humano?: number | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey1"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey1"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_humano_fkey"
            columns: ["team_humano"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_humano_fkey"
            columns: ["team_humano"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_notificaciones_team: {
        Row: {
          agente_id: number | null
          archivado: boolean | null
          asesor_id: number | null
          contacto_id: number | null
          created_at: string
          empresa_id: number | null
          estado: string
          fecha_envio: string
          fecha_respuesta: string | null
          id: number
          mensaje: string
          metadata: Json | null
          origen: string | null
          requiere_respuesta: boolean | null
          respuesta: string | null
          tipo: string
          updated_at: string
          visto: boolean | null
        }
        Insert: {
          agente_id?: number | null
          archivado?: boolean | null
          asesor_id?: number | null
          contacto_id?: number | null
          created_at?: string
          empresa_id?: number | null
          estado?: string
          fecha_envio?: string
          fecha_respuesta?: string | null
          id?: number
          mensaje: string
          metadata?: Json | null
          origen?: string | null
          requiere_respuesta?: boolean | null
          respuesta?: string | null
          tipo: string
          updated_at?: string
          visto?: boolean | null
        }
        Update: {
          agente_id?: number | null
          archivado?: boolean | null
          asesor_id?: number | null
          contacto_id?: number | null
          created_at?: string
          empresa_id?: number | null
          estado?: string
          fecha_envio?: string
          fecha_respuesta?: string | null
          id?: number
          mensaje?: string
          metadata?: Json | null
          origen?: string | null
          requiere_respuesta?: boolean | null
          respuesta?: string | null
          tipo?: string
          updated_at?: string
          visto?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_asesor_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_asesor_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_numeros: {
        Row: {
          ab_test_activo: boolean | null
          activo: boolean | null
          agente_id: number | null
          agente_id_ab: number | null
          canal: string | null
          created_at: string
          elevenlabs_id_voz: string | null
          empresa_id: number | null
          evolution_instance: string | null
          id: number
          id_kapso: string | null
          link_conectar_canal: string | null
          nombre: string | null
          telefono: string | null
          timezone: string | null
          updated_at: string
          waha_session: string | null
        }
        Insert: {
          ab_test_activo?: boolean | null
          activo?: boolean | null
          agente_id?: number | null
          agente_id_ab?: number | null
          canal?: string | null
          created_at?: string
          elevenlabs_id_voz?: string | null
          empresa_id?: number | null
          evolution_instance?: string | null
          id?: never
          id_kapso?: string | null
          link_conectar_canal?: string | null
          nombre?: string | null
          telefono?: string | null
          timezone?: string | null
          updated_at?: string
          waha_session?: string | null
        }
        Update: {
          ab_test_activo?: boolean | null
          activo?: boolean | null
          agente_id?: number | null
          agente_id_ab?: number | null
          canal?: string | null
          created_at?: string
          elevenlabs_id_voz?: string | null
          empresa_id?: number | null
          evolution_instance?: string | null
          id?: never
          id_kapso?: string | null
          link_conectar_canal?: string | null
          nombre?: string | null
          telefono?: string | null
          timezone?: string | null
          updated_at?: string
          waha_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_numeros_agente_id_ab_fkey"
            columns: ["agente_id_ab"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_numeros_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_numeros_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_numeros_horarios: {
        Row: {
          created_at: string
          dias_desactivar: number[]
          dias_siempre_activo: number[]
          empresa_id: number
          habilitado: boolean
          hora_activar: string
          hora_desactivar: string
          id: number
          numero_id: number
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dias_desactivar?: number[]
          dias_siempre_activo?: number[]
          empresa_id: number
          habilitado?: boolean
          hora_activar?: string
          hora_desactivar?: string
          id?: number
          numero_id: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dias_desactivar?: number[]
          dias_siempre_activo?: number[]
          empresa_id?: number
          habilitado?: boolean
          hora_activar?: string
          hora_desactivar?: string
          id?: number
          numero_id?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_numeros_horarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_numeros_horarios_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: true
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_plan_consumo: {
        Row: {
          cantidad_consumida: number | null
          caracteristica_id: number | null
          consumo_extra: number | null
          created_at: string
          id: number
          id_empresa: number | null
          id_plan: string | null
        }
        Insert: {
          cantidad_consumida?: number | null
          caracteristica_id?: number | null
          consumo_extra?: number | null
          created_at?: string
          id?: number
          id_empresa?: number | null
          id_plan?: string | null
        }
        Update: {
          cantidad_consumida?: number | null
          caracteristica_id?: number | null
          consumo_extra?: number | null
          created_at?: string
          id?: number
          id_empresa?: number | null
          id_plan?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_plan_consumo_caracteristica_id_fkey"
            columns: ["caracteristica_id"]
            isOneToOne: false
            referencedRelation: "wp_planes_caracteristicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_plan_consumo_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_plan_consumo_id_plan_fkey"
            columns: ["id_plan"]
            isOneToOne: false
            referencedRelation: "wp_planes_suscripcion"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_planes_caracteristicas: {
        Row: {
          cantidad: number | null
          caracteristica: string | null
          created_at: string
          descripccion: string | null
          id: number
          plan_id: string | null
        }
        Insert: {
          cantidad?: number | null
          caracteristica?: string | null
          created_at?: string
          descripccion?: string | null
          id?: number
          plan_id?: string | null
        }
        Update: {
          cantidad?: number | null
          caracteristica?: string | null
          created_at?: string
          descripccion?: string | null
          id?: number
          plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_planes_caracteristicas_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "wp_planes_suscripcion"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_planes_suscripcion: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          dias_prueba: number | null
          duracion_dias: number | null
          id: string
          metadata: Json | null
          moneda: string | null
          nombre: string
          periodo: Database["public"]["Enums"]["plan_periodo"] | null
          precio: number
          stripe_price_id: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          dias_prueba?: number | null
          duracion_dias?: number | null
          id?: string
          metadata?: Json | null
          moneda?: string | null
          nombre: string
          periodo?: Database["public"]["Enums"]["plan_periodo"] | null
          precio: number
          stripe_price_id?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          dias_prueba?: number | null
          duracion_dias?: number | null
          id?: string
          metadata?: Json | null
          moneda?: string | null
          nombre?: string
          periodo?: Database["public"]["Enums"]["plan_periodo"] | null
          precio?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      wp_prediccion_cierre: {
        Row: {
          accion_plazo: string | null
          accion_recomendada: string | null
          analizado_at: string | null
          cita_id: number | null
          contacto_id: number | null
          created_at: string | null
          duracion_min: number | null
          empresa_id: number | null
          id: number
          monto_cierre: number | null
          nivel: string | null
          razon_principal: string | null
          resultado_fecha: string | null
          resultado_real: string | null
          riesgo: string | null
          score: number | null
          senales_negativas: Json | null
          senales_positivas: Json | null
          transcripcion_id: number | null
          vendedor: string | null
        }
        Insert: {
          accion_plazo?: string | null
          accion_recomendada?: string | null
          analizado_at?: string | null
          cita_id?: number | null
          contacto_id?: number | null
          created_at?: string | null
          duracion_min?: number | null
          empresa_id?: number | null
          id?: number
          monto_cierre?: number | null
          nivel?: string | null
          razon_principal?: string | null
          resultado_fecha?: string | null
          resultado_real?: string | null
          riesgo?: string | null
          score?: number | null
          senales_negativas?: Json | null
          senales_positivas?: Json | null
          transcripcion_id?: number | null
          vendedor?: string | null
        }
        Update: {
          accion_plazo?: string | null
          accion_recomendada?: string | null
          analizado_at?: string | null
          cita_id?: number | null
          contacto_id?: number | null
          created_at?: string | null
          duracion_min?: number | null
          empresa_id?: number | null
          id?: number
          monto_cierre?: number | null
          nivel?: string | null
          razon_principal?: string | null
          resultado_fecha?: string | null
          resultado_real?: string | null
          riesgo?: string | null
          score?: number | null
          senales_negativas?: Json | null
          senales_positivas?: Json | null
          transcripcion_id?: number | null
          vendedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_prediccion_cierre_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_prediccion_cierre_transcripcion_id_fkey"
            columns: ["transcripcion_id"]
            isOneToOne: true
            referencedRelation: "transcripciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_prediccion_cierre_transcripcion_id_fkey"
            columns: ["transcripcion_id"]
            isOneToOne: true
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["transcripcion_id"]
          },
        ]
      }
      wp_proyectos: {
        Row: {
          color: string | null
          config: Json | null
          contacto_id: number | null
          creado_por: number
          created_at: string | null
          descripcion: string | null
          empresa_id: number
          estado: string | null
          fecha_fin_estimada: string | null
          fecha_fin_real: string | null
          fecha_inicio: string | null
          gasto_actual: number | null
          icono: string | null
          id: number
          moneda: string | null
          nombre: string
          orden: number | null
          presupuesto: number | null
          servicio_id: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          config?: Json | null
          contacto_id?: number | null
          creado_por: number
          created_at?: string | null
          descripcion?: string | null
          empresa_id: number
          estado?: string | null
          fecha_fin_estimada?: string | null
          fecha_fin_real?: string | null
          fecha_inicio?: string | null
          gasto_actual?: number | null
          icono?: string | null
          id?: number
          moneda?: string | null
          nombre: string
          orden?: number | null
          presupuesto?: number | null
          servicio_id?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          config?: Json | null
          contacto_id?: number | null
          creado_por?: number
          created_at?: string | null
          descripcion?: string | null
          empresa_id?: number
          estado?: string | null
          fecha_fin_estimada?: string | null
          fecha_fin_real?: string | null
          fecha_inicio?: string | null
          gasto_actual?: number | null
          icono?: string | null
          id?: number
          moneda?: string | null
          nombre?: string
          orden?: number | null
          presupuesto?: number | null
          servicio_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_proyectos_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_proyectos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_proyectos_columnas: {
        Row: {
          color: string | null
          created_at: string
          id: number
          nombre: string
          orden: number
          proyecto_id: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: number
          nombre: string
          orden?: number
          proyecto_id: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: number
          nombre?: string
          orden?: number
          proyecto_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_proyectos_columnas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "vw_proyectos_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_columnas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "wp_proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_proyectos_costos: {
        Row: {
          categoria: string | null
          comprobante_url: string | null
          concepto: string
          created_at: string | null
          fecha_costo: string
          id: number
          moneda: string | null
          monto: number
          notas: string | null
          proyecto_id: number
          registrado_por: number | null
          tarea_id: number | null
        }
        Insert: {
          categoria?: string | null
          comprobante_url?: string | null
          concepto: string
          created_at?: string | null
          fecha_costo?: string
          id?: number
          moneda?: string | null
          monto: number
          notas?: string | null
          proyecto_id: number
          registrado_por?: number | null
          tarea_id?: number | null
        }
        Update: {
          categoria?: string | null
          comprobante_url?: string | null
          concepto?: string
          created_at?: string | null
          fecha_costo?: string
          id?: number
          moneda?: string | null
          monto?: number
          notas?: string | null
          proyecto_id?: number
          registrado_por?: number | null
          tarea_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_proyectos_costos_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "vw_proyectos_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_costos_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "wp_proyectos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_costos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_proyectos_costos_registrado_por_fkey"
            columns: ["registrado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_costos_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_costos_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_recordatorios: {
        Row: {
          contacto_id: number
          conversacion_id: number | null
          created_at: string
          descripcion: string | null
          estado: string
          fecha_hora: string
          id: number
          repeticion: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          contacto_id: number
          conversacion_id?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_hora: string
          id?: number
          repeticion?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          contacto_id?: number
          conversacion_id?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_hora?: string
          id?: number
          repeticion?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_recordatorios_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_recordatorios_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_recordatorios_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "wp_conversaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_suscripcion_historial: {
        Row: {
          cambio_fecha: string | null
          id: string
          motivo: string | null
          plan_id: string | null
          precio_aplicado: number | null
          suscripcion_id: string | null
        }
        Insert: {
          cambio_fecha?: string | null
          id?: string
          motivo?: string | null
          plan_id?: string | null
          precio_aplicado?: number | null
          suscripcion_id?: string | null
        }
        Update: {
          cambio_fecha?: string | null
          id?: string
          motivo?: string | null
          plan_id?: string | null
          precio_aplicado?: number | null
          suscripcion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_suscripcion_historial_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "wp_planes_suscripcion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_suscripcion_historial_suscripcion_id_fkey"
            columns: ["suscripcion_id"]
            isOneToOne: false
            referencedRelation: "wp_suscripciones"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_suscripciones: {
        Row: {
          cancel_at: string | null
          contacto_id: number | null
          created_at: string | null
          empresa_id: number | null
          estado: Database["public"]["Enums"]["suscripcion_estado"] | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: string
          metadata: Json | null
          plan_id: string | null
          precio_actual: number | null
          proxima_facturacion: string | null
          stripe_id_cliente: string | null
          stripe_id_suscripcion: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at?: string | null
          contacto_id?: number | null
          created_at?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["suscripcion_estado"] | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          precio_actual?: number | null
          proxima_facturacion?: string | null
          stripe_id_cliente?: string | null
          stripe_id_suscripcion?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at?: string | null
          contacto_id?: number | null
          created_at?: string | null
          empresa_id?: number | null
          estado?: Database["public"]["Enums"]["suscripcion_estado"] | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          precio_actual?: number | null
          proxima_facturacion?: string | null
          stripe_id_cliente?: string | null
          stripe_id_suscripcion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_suscripciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_suscripciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_suscripciones_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_suscripciones_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "wp_planes_suscripcion"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_system_alerts: {
        Row: {
          context: Json | null
          created_at: string | null
          dismissed_at: string | null
          empresa_id: number | null
          id: string
          message: string | null
          severity: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          dismissed_at?: string | null
          empresa_id?: number | null
          id?: string
          message?: string | null
          severity?: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          dismissed_at?: string | null
          empresa_id?: number | null
          id?: string
          message?: string | null
          severity?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_system_alerts_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas: {
        Row: {
          archivada: boolean
          asignado_a: number | null
          cita_id: number | null
          columna_id: number | null
          contacto_id: number | null
          conversacion_id: number | null
          costo_estimado: number | null
          costo_real: number | null
          creado_por: number
          created_at: string | null
          descripcion: string | null
          descripcion_md: string | null
          empresa_id: number
          estado: string | null
          fecha_completada: string | null
          fecha_vencimiento: string | null
          id: number
          metadata: Json | null
          moneda: string | null
          orden_kanban: number
          portada_url: string | null
          prioridad: number | null
          proyecto_id: number | null
          tiempo_estimado_min: number | null
          tiempo_real_min: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          archivada?: boolean
          asignado_a?: number | null
          cita_id?: number | null
          columna_id?: number | null
          contacto_id?: number | null
          conversacion_id?: number | null
          costo_estimado?: number | null
          costo_real?: number | null
          creado_por: number
          created_at?: string | null
          descripcion?: string | null
          descripcion_md?: string | null
          empresa_id: number
          estado?: string | null
          fecha_completada?: string | null
          fecha_vencimiento?: string | null
          id?: number
          metadata?: Json | null
          moneda?: string | null
          orden_kanban?: number
          portada_url?: string | null
          prioridad?: number | null
          proyecto_id?: number | null
          tiempo_estimado_min?: number | null
          tiempo_real_min?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          archivada?: boolean
          asignado_a?: number | null
          cita_id?: number | null
          columna_id?: number | null
          contacto_id?: number | null
          conversacion_id?: number | null
          costo_estimado?: number | null
          costo_real?: number | null
          creado_por?: number
          created_at?: string | null
          descripcion?: string | null
          descripcion_md?: string | null
          empresa_id?: number
          estado?: string | null
          fecha_completada?: string | null
          fecha_vencimiento?: string | null
          id?: number
          metadata?: Json | null
          moneda?: string | null
          orden_kanban?: number
          portada_url?: string | null
          prioridad?: number | null
          proyecto_id?: number | null
          tiempo_estimado_min?: number | null
          tiempo_real_min?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_columna_id_fkey"
            columns: ["columna_id"]
            isOneToOne: false
            referencedRelation: "wp_proyectos_columnas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "wp_conversaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "vw_proyectos_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "wp_proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_asignados: {
        Row: {
          asignado_por: number | null
          created_at: string | null
          rol: string | null
          tarea_id: number
          team_humano_id: number
        }
        Insert: {
          asignado_por?: number | null
          created_at?: string | null
          rol?: string | null
          tarea_id: number
          team_humano_id: number
        }
        Update: {
          asignado_por?: number | null
          created_at?: string | null
          rol?: string | null
          tarea_id?: number
          team_humano_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_asignados_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_asignados_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_asignados_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_asignados_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_asignados_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_asignados_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_comentarios: {
        Row: {
          autor_id: number | null
          contenido: string
          created_at: string | null
          editado: boolean | null
          id: number
          metadata: Json | null
          tarea_id: number
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          autor_id?: number | null
          contenido: string
          created_at?: string | null
          editado?: boolean | null
          id?: number
          metadata?: Json | null
          tarea_id: number
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          autor_id?: number | null
          contenido?: string
          created_at?: string | null
          editado?: boolean | null
          id?: number
          metadata?: Json | null
          tarea_id?: number
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_comentarios_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_comentarios_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_comentarios_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_comentarios_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_etiquetas: {
        Row: {
          created_at: string | null
          etiqueta_id: number
          tarea_id: number
        }
        Insert: {
          created_at?: string | null
          etiqueta_id: number
          tarea_id: number
        }
        Update: {
          created_at?: string | null
          etiqueta_id?: number
          tarea_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_etiquetas_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "wp_etiquetas_equipo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_etiquetas_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_etiquetas_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_historial: {
        Row: {
          accion: string
          autor_id: number | null
          campo_modificado: string | null
          created_at: string | null
          id: number
          metadata: Json | null
          tarea_id: number
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          accion: string
          autor_id?: number | null
          campo_modificado?: string | null
          created_at?: string | null
          id?: number
          metadata?: Json | null
          tarea_id: number
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          accion?: string
          autor_id?: number | null
          campo_modificado?: string | null
          created_at?: string | null
          id?: number
          metadata?: Json | null
          tarea_id?: number
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_historial_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_historial_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_historial_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_historial_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_items: {
        Row: {
          asignado_a: number | null
          completado: boolean | null
          completado_at: string | null
          completado_por: number | null
          created_at: string | null
          etiqueta_id: number | null
          id: number
          orden: number
          tarea_id: number
          texto: string
        }
        Insert: {
          asignado_a?: number | null
          completado?: boolean | null
          completado_at?: string | null
          completado_por?: number | null
          created_at?: string | null
          etiqueta_id?: number | null
          id?: number
          orden?: number
          tarea_id: number
          texto: string
        }
        Update: {
          asignado_a?: number | null
          completado?: boolean | null
          completado_at?: string | null
          completado_por?: number | null
          created_at?: string | null
          etiqueta_id?: number | null
          id?: number
          orden?: number
          tarea_id?: number
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_items_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_items_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_items_completado_por_fkey"
            columns: ["completado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_items_completado_por_fkey"
            columns: ["completado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_items_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "wp_etiquetas_equipo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_items_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_items_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_media: {
        Row: {
          created_at: string | null
          descripcion: string | null
          es_portada: boolean | null
          id: number
          nombre_archivo: string
          storage_path: string
          subido_por: number | null
          tamaño_bytes: number
          tarea_id: number
          tipo_mime: string
          url_publica: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          es_portada?: boolean | null
          id?: number
          nombre_archivo: string
          storage_path: string
          subido_por?: number | null
          tamaño_bytes: number
          tarea_id: number
          tipo_mime: string
          url_publica?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          es_portada?: boolean | null
          id?: number
          nombre_archivo?: string
          storage_path?: string
          subido_por?: number | null
          tamaño_bytes?: number
          tarea_id?: number
          tipo_mime?: string
          url_publica?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_media_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_media_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_media_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "vw_tareas_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_media_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_tareas_reacciones: {
        Row: {
          comentario_id: number
          created_at: string | null
          emoji: string
          usuario_id: number
        }
        Insert: {
          comentario_id: number
          created_at?: string | null
          emoji: string
          usuario_id: number
        }
        Update: {
          comentario_id?: number
          created_at?: string | null
          emoji?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_reacciones_comentario_id_fkey"
            columns: ["comentario_id"]
            isOneToOne: false
            referencedRelation: "wp_tareas_comentarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_reacciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_reacciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_team_humano: {
        Row: {
          acepta_citas: boolean | null
          analisis_asesor: string | null
          apellido: string | null
          auth_uid: string | null
          calendly: string | null
          created_at: string
          deleted: string | null
          disponibilidad: Json | null
          duracion_cita_minutos: number | null
          email: string
          empresa_id: number
          enterprise_id: number
          especialidad: string | null
          grant_id: string | null
          grupo_whatsapp: string | null
          id: number
          id_contacto: number | null
          is_active: boolean | null
          metadata: Json | null
          multimedia: string | null
          nombre: string
          notetaker: boolean | null
          prioridad: string | null
          rol: string
          role_id: number | null
          slack_id: string | null
          telefono: string | null
          temporal_nylas: string | null
          timezone: string | null
          ultima_asignacion: string | null
          updated_at: string
          webinar: string | null
        }
        Insert: {
          acepta_citas?: boolean | null
          analisis_asesor?: string | null
          apellido?: string | null
          auth_uid?: string | null
          calendly?: string | null
          created_at?: string
          deleted?: string | null
          disponibilidad?: Json | null
          duracion_cita_minutos?: number | null
          email: string
          empresa_id: number
          enterprise_id: number
          especialidad?: string | null
          grant_id?: string | null
          grupo_whatsapp?: string | null
          id?: never
          id_contacto?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          multimedia?: string | null
          nombre: string
          notetaker?: boolean | null
          prioridad?: string | null
          rol: string
          role_id?: number | null
          slack_id?: string | null
          telefono?: string | null
          temporal_nylas?: string | null
          timezone?: string | null
          ultima_asignacion?: string | null
          updated_at?: string
          webinar?: string | null
        }
        Update: {
          acepta_citas?: boolean | null
          analisis_asesor?: string | null
          apellido?: string | null
          auth_uid?: string | null
          calendly?: string | null
          created_at?: string
          deleted?: string | null
          disponibilidad?: Json | null
          duracion_cita_minutos?: number | null
          email?: string
          empresa_id?: number
          enterprise_id?: number
          especialidad?: string | null
          grant_id?: string | null
          grupo_whatsapp?: string | null
          id?: never
          id_contacto?: number | null
          is_active?: boolean | null
          metadata?: Json | null
          multimedia?: string | null
          nombre?: string
          notetaker?: boolean | null
          prioridad?: string | null
          rol?: string
          role_id?: number | null
          slack_id?: string | null
          telefono?: string | null
          temporal_nylas?: string | null
          timezone?: string | null
          ultima_asignacion?: string | null
          updated_at?: string
          webinar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_team_humano_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_humano_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_humano_id_contacto_fkey"
            columns: ["id_contacto"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_humano_id_contacto_fkey"
            columns: ["id_contacto"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_humano_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "system_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          empresa_id: number
          expires_at: string | null
          id: number
          invited_by: number | null
          metadata: Json | null
          rol: string
          role_id: number
          status: string
          team_member_id: number | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          empresa_id: number
          expires_at?: string | null
          id?: number
          invited_by?: number | null
          metadata?: Json | null
          rol?: string
          role_id?: number
          status?: string
          team_member_id?: number | null
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          empresa_id?: number
          expires_at?: string | null
          id?: number
          invited_by?: number | null
          metadata?: Json | null
          rol?: string
          role_id?: number
          status?: string
          team_member_id?: number | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_team_invitations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_invitations_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_team_invitations_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_user_engagement: {
        Row: {
          created_at: string | null
          device_type: string | null
          empresa_id: number | null
          event_name: string
          event_type: string
          id: number
          metadata: Json | null
          module: string
          session_id: string | null
          sub_module: string | null
          team_humano_id: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          empresa_id?: number | null
          event_name: string
          event_type: string
          id?: number
          metadata?: Json | null
          module: string
          session_id?: string | null
          sub_module?: string | null
          team_humano_id?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          empresa_id?: number | null
          event_name?: string
          event_type?: string
          id?: number
          metadata?: Json | null
          module?: string
          session_id?: string | null
          sub_module?: string | null
          team_humano_id?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_user_engagement_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_user_engagement_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_user_engagement_team_humano_id_fkey"
            columns: ["team_humano_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_user_engagement_daily: {
        Row: {
          created_at: string | null
          date: string
          empresa_id: number | null
          features_used: string[] | null
          first_activity_at: string | null
          id: number
          last_activity_at: string | null
          modules_used: string[] | null
          session_count: number | null
          total_actions: number | null
          total_duration_seconds: number | null
          total_events: number | null
          total_page_views: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          empresa_id?: number | null
          features_used?: string[] | null
          first_activity_at?: string | null
          id?: number
          last_activity_at?: string | null
          modules_used?: string[] | null
          session_count?: number | null
          total_actions?: number | null
          total_duration_seconds?: number | null
          total_events?: number | null
          total_page_views?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          empresa_id?: number | null
          features_used?: string[] | null
          first_activity_at?: string | null
          id?: number
          last_activity_at?: string | null
          modules_used?: string[] | null
          session_count?: number | null
          total_actions?: number | null
          total_duration_seconds?: number | null
          total_events?: number | null
          total_page_views?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_user_engagement_daily_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_videos: {
        Row: {
          analisis_video: string | null
          asesor_id: number | null
          cita_externa_id: string | null
          cita_id: number | null
          created_at: string | null
          empresa_id: number
          fecha: string | null
          id: number
          link: string | null
          nombre_asesor: string | null
          nombre_video: string | null
          updated_at: string | null
        }
        Insert: {
          analisis_video?: string | null
          asesor_id?: number | null
          cita_externa_id?: string | null
          cita_id?: number | null
          created_at?: string | null
          empresa_id: number
          fecha?: string | null
          id?: number
          link?: string | null
          nombre_asesor?: string | null
          nombre_video?: string | null
          updated_at?: string | null
        }
        Update: {
          analisis_video?: string | null
          asesor_id?: number | null
          cita_externa_id?: string | null
          cita_id?: number | null
          created_at?: string | null
          empresa_id?: number
          fecha?: string | null
          id?: number
          link?: string | null
          nombre_asesor?: string | null
          nombre_video?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_video_asesor"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "fk_video_asesor"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_video_cita"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_video_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_whatsapp_template_envios: {
        Row: {
          category: string | null
          clasificacion_interna: string | null
          contacto_id: number | null
          conversacion_id: number | null
          created_at: string
          delivered_at: string | null
          empresa_id: number
          enviado_por: number | null
          error_code: string | null
          error_message: string | null
          estado: string
          failed_at: string | null
          id: number
          language_code: string
          mensaje_id: number | null
          meta_category: string | null
          metadata: Json
          numero_id: number
          parametros_resueltos: Json
          payload: Json
          provider: string
          provider_message_id: string | null
          provider_template_id: string | null
          read_at: string | null
          rendered_body: string | null
          sent_at: string | null
          telefono_destino: string
          template_id: number | null
          template_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          clasificacion_interna?: string | null
          contacto_id?: number | null
          conversacion_id?: number | null
          created_at?: string
          delivered_at?: string | null
          empresa_id: number
          enviado_por?: number | null
          error_code?: string | null
          error_message?: string | null
          estado?: string
          failed_at?: string | null
          id?: number
          language_code: string
          mensaje_id?: number | null
          meta_category?: string | null
          metadata?: Json
          numero_id: number
          parametros_resueltos?: Json
          payload?: Json
          provider?: string
          provider_message_id?: string | null
          provider_template_id?: string | null
          read_at?: string | null
          rendered_body?: string | null
          sent_at?: string | null
          telefono_destino: string
          template_id?: number | null
          template_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          clasificacion_interna?: string | null
          contacto_id?: number | null
          conversacion_id?: number | null
          created_at?: string
          delivered_at?: string | null
          empresa_id?: number
          enviado_por?: number | null
          error_code?: string | null
          error_message?: string | null
          estado?: string
          failed_at?: string | null
          id?: number
          language_code?: string
          mensaje_id?: number | null
          meta_category?: string | null
          metadata?: Json
          numero_id?: number
          parametros_resueltos?: Json
          payload?: Json
          provider?: string
          provider_message_id?: string | null
          provider_template_id?: string | null
          read_at?: string | null
          rendered_body?: string | null
          sent_at?: string | null
          telefono_destino?: string
          template_id?: number | null
          template_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wp_whatsapp_template_envios_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "wp_conversaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_mensaje_id_fkey"
            columns: ["mensaje_id"]
            isOneToOne: false
            referencedRelation: "wp_mensajes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: false
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_template_envios_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "wp_whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_whatsapp_templates: {
        Row: {
          business_account_id: string | null
          category: string
          clasificacion_interna: string | null
          components: Json
          created_at: string
          empresa_id: number
          example_payload: Json
          external_created_at: string | null
          external_updated_at: string | null
          header_type: string | null
          id: number
          is_active: boolean
          language_code: string
          last_synced_at: string | null
          meta_category: string
          metadata: Json
          numero_id: number
          provider: string
          provider_phone_id: string | null
          provider_template_id: string | null
          quality_rating: string | null
          rejection_reason: string | null
          status: string
          template_name: string
          updated_at: string
          variables_schema: Json
        }
        Insert: {
          business_account_id?: string | null
          category: string
          clasificacion_interna?: string | null
          components?: Json
          created_at?: string
          empresa_id: number
          example_payload?: Json
          external_created_at?: string | null
          external_updated_at?: string | null
          header_type?: string | null
          id?: number
          is_active?: boolean
          language_code: string
          last_synced_at?: string | null
          meta_category?: string
          metadata?: Json
          numero_id: number
          provider?: string
          provider_phone_id?: string | null
          provider_template_id?: string | null
          quality_rating?: string | null
          rejection_reason?: string | null
          status?: string
          template_name: string
          updated_at?: string
          variables_schema?: Json
        }
        Update: {
          business_account_id?: string | null
          category?: string
          clasificacion_interna?: string | null
          components?: Json
          created_at?: string
          empresa_id?: number
          example_payload?: Json
          external_created_at?: string | null
          external_updated_at?: string | null
          header_type?: string | null
          id?: number
          is_active?: boolean
          language_code?: string
          last_synced_at?: string | null
          meta_category?: string
          metadata?: Json
          numero_id?: number
          provider?: string
          provider_phone_id?: string | null
          provider_template_id?: string | null
          quality_rating?: string | null
          rejection_reason?: string | null
          status?: string
          template_name?: string
          updated_at?: string
          variables_schema?: Json
        }
        Relationships: [
          {
            foreignKeyName: "wp_whatsapp_templates_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_whatsapp_templates_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: false
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mv_task_current_state: {
        Row: {
          age_days: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          escalation_count: number | null
          event_count: number | null
          id: string | null
          last_event_at: string | null
          last_inbound_at: string | null
          last_outbound_at: string | null
          metadata: Json | null
          owner_email: string | null
          priority: string | null
          project_id: string | null
          status: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dim_task_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "dim_task_owner_email_fkey"
            columns: ["owner_email"]
            isOneToOne: false
            referencedRelation: "dim_person"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "dim_task_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "dim_project"
            referencedColumns: ["id"]
          },
        ]
      }
      v_duplicados_conversaciones: {
        Row: {
          contacto_id: number | null
          duplicados: number | null
          fecha: string | null
          ids: string | null
          numero_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_conversaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_conversaciones_numero_id_fkey"
            columns: ["numero_id"]
            isOneToOne: false
            referencedRelation: "wp_numeros"
            referencedColumns: ["id"]
          },
        ]
      }
      v_pipeline_prediccion: {
        Row: {
          accion_plazo: string | null
          accion_recomendada: string | null
          analizado_at: string | null
          contacto_apellido: string | null
          contacto_nombre: string | null
          contacto_telefono: string | null
          duracion_min: number | null
          estado_cita: string | null
          fecha_cita: string | null
          id: number | null
          nivel: string | null
          razon_principal: string | null
          resultado_real: string | null
          riesgo: string | null
          score: number | null
          vendedor: string | null
        }
        Relationships: []
      }
      vista_transcripciones_completas: {
        Row: {
          analisis_asesor: string | null
          asesor_activo: boolean | null
          asesor_apellido: string | null
          asesor_email: string | null
          asesor_especialidad: string | null
          asesor_id: number | null
          asesor_nombre: string | null
          asesor_rol: string | null
          cita_contacto_id: number | null
          cita_descripcion: string | null
          cita_duracion: number | null
          cita_empresa_id: number | null
          cita_estado: string | null
          cita_event_id: string | null
          cita_fecha_hora: string | null
          cita_id: number | null
          cita_resumen_conversacion: string | null
          cita_titulo: string | null
          cita_ubicacion: string | null
          created_at: string | null
          duracion: number | null
          empresa_id: number | null
          grant_id: string | null
          resumen: string | null
          resumen_cita: string | null
          transcripcion: string | null
          transcripcion_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripciones_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_contacto_id_fkey"
            columns: ["cita_contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_contacto_id_fkey"
            columns: ["cita_contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_citas_empresa_id_fkey"
            columns: ["cita_empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_team_humano_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_agent_changelog: {
        Row: {
          accion: string | null
          agent_id: number | null
          campo: string | null
          fecha: string | null
          id: number | null
          nombre_agente: string | null
          tabla: string | null
          usuario_id: number | null
          usuario_nombre: string | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Relationships: []
      }
      vw_contact_pause_status: {
        Row: {
          apellido: string | null
          email: string | null
          empresa_id: number | null
          id: number | null
          is_active: boolean | null
          nombre: string | null
          pause_status: string | null
          paused_until: string | null
          seconds_remaining: number | null
          telefono: string | null
        }
        Insert: {
          apellido?: string | null
          email?: string | null
          empresa_id?: number | null
          id?: number | null
          is_active?: boolean | null
          nombre?: string | null
          pause_status?: never
          paused_until?: string | null
          seconds_remaining?: never
          telefono?: string | null
        }
        Update: {
          apellido?: string | null
          email?: string | null
          empresa_id?: number | null
          id?: number | null
          is_active?: boolean | null
          nombre?: string | null
          pause_status?: never
          paused_until?: string | null
          seconds_remaining?: never
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_contactos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_facturacion_resumen: {
        Row: {
          empresa_id: number | null
          facturas_emitidas: number | null
          facturas_pagadas: number | null
          facturas_vencidas: number | null
          moneda: string | null
          total_cobrado: number | null
          total_facturado: number | null
          total_facturas: number | null
          total_pendiente: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_facturas_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_facturas_contactos: {
        Row: {
          asesor_id: number | null
          cliente_direccion: string | null
          cliente_documento: string | null
          cliente_email: string | null
          cliente_nombre: string | null
          cliente_pais: string | null
          cliente_telefono: string | null
          contacto_email_actual: string | null
          contacto_id: number | null
          contacto_nombre_completo: string | null
          contacto_telefono_actual: string | null
          created_at: string | null
          created_by: number | null
          descuentos: number | null
          empresa_direccion: string | null
          empresa_documento: string | null
          empresa_email: string | null
          empresa_id: number | null
          empresa_logo_url: string | null
          empresa_nombre: string | null
          empresa_sitio_web: string | null
          empresa_telefono: string | null
          estado: string | null
          fecha_emision: string | null
          fecha_vencimiento: string | null
          id: number | null
          impuestos: number | null
          items: Json | null
          metadata: Json | null
          moneda: string | null
          monto_pagado: number | null
          notas: string | null
          numero_factura: string | null
          pago_id: number | null
          pdf_url: string | null
          prefijo: string | null
          saldo_pendiente: number | null
          secuencia: number | null
          servicio_id: number | null
          subtotal: number | null
          terminos: string | null
          total: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_facturas_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_contacto"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_pago"
            columns: ["pago_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_pagos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_servicio"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_servicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_contactos_team_humano_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_contactos_team_humano_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_notificaciones_con_contacto: {
        Row: {
          agente_id: number | null
          archivado: boolean | null
          asesor_id: number | null
          contact_apellido: string | null
          contact_nombre: string | null
          contact_telefono: string | null
          contact_ultima_interaccion: string | null
          contacto_id: number | null
          created_at: string | null
          empresa_id: number | null
          estado: string | null
          fecha_envio: string | null
          fecha_respuesta: string | null
          id: number | null
          mensaje: string | null
          metadata: Json | null
          origen: string | null
          requiere_respuesta: boolean | null
          respuesta: string | null
          tipo: string | null
          updated_at: string | null
          visto: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "wp_agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_asesor_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_asesor_id_fkey"
            columns: ["asesor_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_notificaciones_team_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_proyectos_metricas: {
        Row: {
          color: string | null
          config: Json | null
          contacto_apellido: string | null
          contacto_id: number | null
          contacto_nombre: string | null
          creado_por: number | null
          created_at: string | null
          descripcion: string | null
          empresa_id: number | null
          estado: string | null
          fecha_fin_estimada: string | null
          fecha_fin_real: string | null
          fecha_inicio: string | null
          gasto_actual: number | null
          icono: string | null
          id: number | null
          moneda: string | null
          nombre: string | null
          nombre_servicio: string | null
          orden: number | null
          porcentaje_completado: number | null
          porcentaje_gastado: number | null
          presupuesto: number | null
          servicio_id: number | null
          servicio_valor: number | null
          tareas_completadas: number | null
          tareas_vencidas: number | null
          total_tareas: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_proyectos_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_proyectos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_proyectos_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "wp_crm_servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_tareas_completas: {
        Row: {
          asignado_a: number | null
          cita_id: number | null
          contacto_apellido: string | null
          contacto_id: number | null
          contacto_nombre: string | null
          conversacion_id: number | null
          costo_estimado: number | null
          costo_real: number | null
          creado_por: number | null
          created_at: string | null
          descripcion: string | null
          descripcion_md: string | null
          empresa_id: number | null
          estado: string | null
          etiquetas: string[] | null
          fecha_completada: string | null
          fecha_vencimiento: string | null
          id: number | null
          items_completados: number | null
          metadata: Json | null
          moneda: string | null
          portada_url: string | null
          prioridad: number | null
          proyecto_color: string | null
          proyecto_id: number | null
          proyecto_nombre: string | null
          tiempo_estimado_min: number | null
          tiempo_real_min: number | null
          titulo: string | null
          total_comentarios: number | null
          total_items: number | null
          total_media: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wp_tareas_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "wp_citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "vw_contact_pause_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_contacto_id_fkey"
            columns: ["contacto_id"]
            isOneToOne: false
            referencedRelation: "wp_contactos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_conversacion_id_fkey"
            columns: ["conversacion_id"]
            isOneToOne: false
            referencedRelation: "wp_conversaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "wp_tareas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "vw_proyectos_metricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wp_tareas_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "wp_proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_training_courses_stats: {
        Row: {
          categoria: string | null
          color_tema: string | null
          created_at: string | null
          descripcion: string | null
          dificultad: string | null
          duracion_estimada_min: number | null
          empresa_id: number | null
          id: string | null
          is_active: boolean | null
          is_public: boolean | null
          lessons_count: number | null
          orden: number | null
          portada_url: string | null
          questions_count: number | null
          titulo: string | null
          total_xp: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_courses_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "wp_empresa_perfil"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_training_user_dashboard: {
        Row: {
          categoria: string | null
          color_tema: string | null
          completed_lessons: number | null
          course_id: string | null
          course_titulo: string | null
          last_activity: string | null
          progress_percent: number | null
          team_member_id: number | null
          total_lessons: number | null
          total_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_user_progress_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "vista_transcripciones_completas"
            referencedColumns: ["asesor_id"]
          },
          {
            foreignKeyName: "training_user_progress_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "wp_team_humano"
            referencedColumns: ["id"]
          },
        ]
      }
      wp_agentes_historial: {
        Row: {
          agente_id: number | null
          campo: string | null
          created_at: string | null
          id: number | null
          mensaje_commit: string | null
          usuario_id: number | null
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          agente_id?: number | null
          campo?: string | null
          created_at?: string | null
          id?: number | null
          mensaje_commit?: string | null
          usuario_id?: number | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          agente_id?: number | null
          campo?: string | null
          created_at?: string | null
          id?: number | null
          mensaje_commit?: string | null
          usuario_id?: number | null
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_team_invitation: {
        Args: {
          p_apellido: string
          p_auth_uid?: string
          p_nombre: string
          p_telefono?: string
          p_token: string
        }
        Returns: {
          empresa_id: number
          member_id: number
          message: string
          success: boolean
        }[]
      }
      accept_team_invitation_v2: {
        Args: {
          p_apellido: string
          p_auth_uid?: string
          p_nombre: string
          p_telefono?: string
          p_token: string
        }
        Returns: {
          empresa_id: number
          member_id: number
          message: string
          success: boolean
        }[]
      }
      actualizar_calificacion_existentes: {
        Args: never
        Returns: {
          actualizado: boolean
          cita_id: number
          contacto_id: number
          estado_anterior: string
          estado_nuevo: string
          nombre_contacto: string
          pregunta_elegibilidad: string
        }[]
      }
      analyze_anomalies: { Args: never; Returns: number }
      analyze_etas: { Args: never; Returns: number }
      asignar_contactos_vacios: { Args: never; Returns: Json }
      auth_validate_channel_key: { Args: { p_api_key: string }; Returns: Json }
      calcular_tiempo_real_tarea: {
        Args: { p_tarea_id: number }
        Returns: number
      }
      cancel_enrollment: {
        Args: { p_enrollment_id: number; p_motivo?: string }
        Returns: boolean
      }
      check_origin: { Args: never; Returns: boolean }
      check_user_permission: {
        Args: {
          action_name: string
          module_name: string
          user_auth_uid: string
        }
        Returns: boolean
      }
      clean_inactive_team_assignments: {
        Args: never
        Returns: {
          contactos_actualizados: number
          detalles: Json
        }[]
      }
      cleanup_expired_invitations: { Args: never; Returns: number }
      contar_mensajes_por_remitente: {
        Args: {
          p_empresa_id: string
          p_fecha_fin: string
          p_fecha_inicio: string
        }
        Returns: {
          cantidad: number
          remitente: string
        }[]
      }
      count_contacts_by_appointment_status: {
        Args: { p_empresa_id: number; p_status: string }
        Returns: number
      }
      count_contacts_by_portfolio_status: {
        Args: { p_empresa_id: number; p_status: string }
        Returns: number
      }
      count_dynamic_audience: {
        Args: {
          p_appointment_status?: string
          p_empresa_id: number
          p_portfolio_status?: string
        }
        Returns: number
      }
      create_team_invitation_v2: {
        Args: {
          p_email: string
          p_empresa_id: number
          p_invited_by: number
          p_rol: string
          p_role_id: number
        }
        Returns: {
          invitation_id: number
          invitation_token: string
          member_id: number
          message: string
          success: boolean
        }[]
      }
      current_user_email: { Args: never; Returns: string }
      dashboard_contact_appointment_trend: {
        Args: {
          p_empresa_id: number
          p_from: string
          p_team_member_ids?: number[]
          p_to: string
          p_tz?: string
          p_use_scheduled?: boolean
        }
        Returns: {
          citas: number
          contactos: number
          fecha: string
        }[]
      }
      detectar_conversaciones_abandonadas: {
        Args: never
        Returns: {
          agente_id: number
          apellido: string
          contacto_id: number
          conversacion_id: number
          email: string
          empresa_id: number
          es_calificado: string
          estado: string
          is_active: boolean
          minutos_sin_respuesta: number
          nombre: string
          numero_id: number
          subscriber_id: string
          telefono: string
          tiene_follow_up_reciente: boolean
          ultimo_mensaje_timestamp: string
        }[]
      }
      ejecutar_query_seguro: { Args: { query_sql: string }; Returns: Json }
      encolar_sync_drive_contacto_cliente: {
        Args: { p_contacto_id: number }
        Returns: number
      }
      enroll_contacts_in_campaign: {
        Args: {
          p_campana_id: number
          p_contacto_ids?: number[]
          p_empresa_id: number
          p_first_send_delay_minutes?: number
        }
        Returns: {
          enrolled_count: number
          message: string
          skipped_count: number
        }[]
      }
      enviar_mensaje_respuesta: {
        Args: {
          p_contenido: string
          p_conversacion_id: number
          p_metadata?: Json
          p_remitente?: string
          p_tipo?: string
        }
        Returns: Json
      }
      export_contactos_csv: {
        Args: never
        Returns: {
          csv_data: string
        }[]
      }
      fix_funnel_stage_orders: {
        Args: { p_enterprise_id: number }
        Returns: {
          new_order: number
          old_order: number
          stage_id: number
        }[]
      }
      fn_cleanup_old_audit: { Args: { p_days?: number }; Returns: number }
      fn_crear_etapas_genericas_empresa: {
        Args: { p_empresa_id: number }
        Returns: undefined
      }
      fn_cron_activar_numeros: { Args: never; Returns: undefined }
      fn_cron_desactivar_numeros: { Args: never; Returns: undefined }
      fn_get_agent_history: {
        Args: { p_agente_id: number; p_campo?: string; p_limit?: number }
        Returns: {
          agente_id: number
          campo: string
          created_at: string
          id: number
          mensaje_commit: string
          usuario_id: number
          usuario_nombre: string
          valor_anterior: string
          valor_nuevo: string
        }[]
      }
      fn_norm_es_calificado: { Args: { v: string }; Returns: string }
      fn_norm_estado_cita: { Args: { v: string }; Returns: string }
      fn_norm_text: { Args: { v: string }; Returns: string }
      fn_obtener_nombre_etapa: {
        Args: { p_empresa_id: number; p_orden_etapa: number }
        Returns: string
      }
      fn_restore_agent_field: {
        Args: { p_historial_id: number; p_usuario_id?: number }
        Returns: boolean
      }
      fn_restore_enterprise_field: {
        Args: { p_historial_id: number; p_usuario_id?: number }
        Returns: boolean
      }
      fork_artifact: { Args: { source_artifact_id: string }; Returns: string }
      generate_artifact_slug: {
        Args: { artifact_title: string }
        Returns: string
      }
      generate_invoice_number: {
        Args: { p_empresa_id: number; p_prefijo?: string }
        Returns: string
      }
      get_agent_context: {
        Args: { p_session_id: string; p_user_id: string }
        Returns: Json
      }
      get_agent_pending_conversations: {
        Args: { p_agente_id: number }
        Returns: {
          chatbot_nombre: string
          chatbot_tipo: string
          conversation_id: number
          external_user_name: string
          external_user_phone: string
          mensajes_pendientes: number
          prioridad: number
          ultimo_mensaje: string
          ultimo_mensaje_at: string
        }[]
      }
      get_contact_suggestions: {
        Args: {
          p_enterprise_id: number
          p_limit?: number
          p_search_query: string
        }
        Returns: {
          contact_id: number
          similarity_score: number
          suggested_name: string
        }[]
      }
      get_contacto_asignaciones: {
        Args: { p_contacto_id: number }
        Returns: {
          contacto_id: number
          created_at: string
          es_principal: boolean
          id: number
          rol_asignacion: string
          team_apellido: string
          team_email: string
          team_humano_id: number
          team_is_active: boolean
          team_nombre: string
          team_rol: string
        }[]
      }
      get_contactos_campana_v2: {
        Args: { p_limit: number }
        Returns: {
          apellido: string
          cadencia_dias: number
          campana_id: number
          campana_nombre: string
          contacto_id: number
          email: string
          empresa_id: number
          id: number
          nombre: string
          proximo_envio_en: string
          suscripcion: string
          total_toques: number
          ultimo_toque: number
        }[]
      }
      get_contacts_by_appointment_status: {
        Args: { p_empresa_id: number; p_status: string }
        Returns: {
          contact_id: number
        }[]
      }
      get_contacts_by_portfolio_status: {
        Args: { p_empresa_id: number; p_status: string }
        Returns: {
          contact_id: number
        }[]
      }
      get_current_team_member: {
        Args: never
        Returns: {
          apellido: string
          disponibilidad: Json
          email: string
          empresa_id: number
          especialidad: string
          id: number
          nombre: string
          rol: string
        }[]
      }
      get_current_user_empresa_id: { Args: never; Returns: number }
      get_current_user_team_id: { Args: never; Returns: number }
      get_dashboard_analytics: {
        Args: {
          p_date_from: string
          p_date_to: string
          p_empresa_id: number
          p_team_member_ids?: number[]
        }
        Returns: Json
      }
      get_dashboard_kpis: {
        Args: {
          p_date_from: string
          p_date_to: string
          p_empresa_id: number
          p_team_member_ids?: number[]
        }
        Returns: Json
      }
      get_dashboard_lists: {
        Args: {
          p_date_from: string
          p_date_to: string
          p_empresa_id: number
          p_team_member_ids?: number[]
        }
        Returns: Json
      }
      get_email_marketing_stats: {
        Args: { p_empresa_id: number }
        Returns: Json
      }
      get_enterprise_inbox: {
        Args: { p_empresa_id: number }
        Returns: {
          canal: string
          contacto_id: number
          contacto_origen: string
          contacto_ultima_interaccion: string
          estado: string
          id: number
          nombre_contacto: string
          nombre_numero: string
          numero_canal: string
          numero_id: number
          remitente_ultimo_mensaje: string
          telefono_contacto: string
          telefono_numero: string
          ultimo_mensaje_contenido: string
          ultimo_mensaje_fecha: string
        }[]
      }
      get_enterprise_inbox_paginated: {
        Args: {
          p_canal?: string
          p_empresa_id: number
          p_limit?: number
          p_numero_id?: number
          p_offset?: number
          p_team_humano_id?: number
        }
        Returns: {
          canal: string
          contacto_id: number
          contacto_origen: string
          contacto_ultima_interaccion: string
          estado: string
          id: number
          nombre_contacto: string
          nombre_numero: string
          numero_canal: string
          numero_id: number
          remitente_ultimo_mensaje: string
          telefono_contacto: string
          telefono_numero: string
          total_count: number
          ultimo_mensaje_contenido: string
          ultimo_mensaje_fecha: string
        }[]
      }
      get_funnel_stage_counts: {
        Args: { p_empresa_id: number }
        Returns: {
          count: number
          etapa_id: number
        }[]
      }
      get_funnel_stage_counts_filtered: {
        Args: { p_empresa_id: number; p_team_humano_ids?: number[] }
        Returns: {
          count: number
          etapa_id: number
        }[]
      }
      get_metrics_for_enterprise: {
        Args: { p_empresa_id: number }
        Returns: {
          conversation_count: number
          message_count: number
        }[]
      }
      get_module_usage_stats: {
        Args: {
          p_days?: number
          p_empresa_id?: number
          p_enterprise_id?: number
        }
        Returns: {
          module: string
          total_actions: number
          total_views: number
          unique_users: number
          usage_percentage: number
        }[]
      }
      get_next_funnel_order: {
        Args: { p_enterprise_id: number }
        Returns: number
      }
      get_notification_stats: {
        Args: { p_asesor_id?: number; p_empresa_id: number }
        Returns: {
          by_type: Json
          requires_response: number
          total: number
          unread: number
        }[]
      }
      get_pending_email_campaigns_v3: {
        Args: {
          p_campana_id?: number
          p_excluir_campana_id?: number
          p_limit?: number
        }
        Returns: {
          apellido: string
          cadencia_dias: number
          campana_id: number
          campana_nombre: string
          contacto_id: number
          email: string
          empresa_id: number
          id: number
          nombre: string
          proximo_envio_en: string
          suscripcion: string
          total_toques: number
          ultimo_toque: number
        }[]
      }
      get_retention_metrics: {
        Args: {
          p_days?: number
          p_empresa_id?: number
          p_enterprise_id?: number
        }
        Returns: {
          avg_modules_per_user: number
          avg_sessions_per_user: number
          dau: number
          mau: number
          retention_rate: number
          wau: number
        }[]
      }
      get_team_humano_for_user: {
        Args: { p_auth_uid: string }
        Returns: {
          empresa_id: number
          id: number
          is_active: boolean
          nombre: string
          rol: string
        }[]
      }
      get_user_empresa_id: { Args: never; Returns: number }
      get_user_empresa_ids: { Args: never; Returns: number[] }
      get_user_permissions: {
        Args: { user_auth_uid: string }
        Returns: {
          actions: Json
          module_name: string
        }[]
      }
      historial_de_correos: {
        Args: { p_contacto_id: number; p_limite: number }
        Returns: {
          asunto: string
          cuerpo_texto: string
          enviado_en: string
          tipo: string
        }[]
      }
      increment_clicks: { Args: { link_uuid: string }; Returns: number }
      insert_assistant_message: {
        Args: {
          p_agent_id?: number
          p_content: string
          p_conversation_id: string
          p_metadata?: Json
        }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_for_empresa: {
        Args: { empresa_id_param: number }
        Returns: boolean
      }
      is_dev_team_member: { Args: never; Returns: boolean }
      jsonb_merge: { Args: { source: string; target: Json }; Returns: Json }
      jsonb_set_nested: {
        Args: { new_value: string; path_array: string[]; target_jsonb: Json }
        Returns: Json
      }
      make_artifact_public: { Args: { artifact_uuid: string }; Returns: string }
      mark_all_notifications_read: {
        Args: { p_asesor_id?: number; p_empresa_id: number }
        Returns: number
      }
      mark_overdue_invoices: { Args: never; Returns: number }
      merge_contacts:
        | {
            Args: {
              p_empresa_id?: number
              p_field_choices?: Json
              p_merged_by?: number
              p_primary_id: number
              p_secondary_id: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_empresa_id?: number
              p_field_choices?: Json
              p_merged_by?: number
              p_notes_strategy?: string
              p_primary_id: number
              p_secondary_id: number
            }
            Returns: Json
          }
      merge_contacts_preview: {
        Args: { p_primary_id: number; p_secondary_id: number }
        Returns: Json
      }
      monica_search_memories: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          created_at: string
          id: string
          importance: number
          similarity: number
          summary: string
        }[]
      }
      nombre_de_tu_funcion: {
        Args: { p_limit: number }
        Returns: {
          apellido: string
          cadencia_dias: number
          campana_id: number
          campana_nombre: string
          contacto_id: number
          email: string
          empresa_id: number
          id: number
          nombre: string
          proximo_envio_en: string
          suscripcion: boolean
          total_toques: number
          ultimo_toque: number
        }[]
      }
      normalize_spanish_phonetic: {
        Args: { input_text: string }
        Returns: string
      }
      notify_tasks_due_soon: { Args: never; Returns: undefined }
      obtener_bi_prospectiva: {
        Args: {
          p_cantidad_muestra: number
          p_empresa_id?: number
          p_fecha_fin: string
          p_fecha_inicio: string
        }
        Returns: Json
      }
      obtener_contactos_para_envio_v2: {
        Args: { p_contacto_id?: number; p_limit?: number }
        Returns: {
          apellido: string
          cadencia_dias: number
          campana_id: number
          campana_nombre: string
          contacto_id: number
          email: string
          empresa_id: number
          estado: string
          id: number
          nombre: string
          proximo_envio_en: string
          total_toques: number
          ultimo_toque: number
        }[]
      }
      obtener_contexto_analista: {
        Args: { p_empresa_id: number; p_usuario_email: string }
        Returns: Json
      }
      obtener_informe_equipo: {
        Args: {
          p_cantidad_muestra: number
          p_empresa_id: number
          p_fecha_fin: string
          p_fecha_inicio: string
          p_solo_activos: boolean
        }
        Returns: Json
      }
      obtener_metricas_mensajes: {
        Args: {
          p_empresa_id: string
          p_fecha_fin: string
          p_fecha_inicio: string
        }
        Returns: {
          conversaciones_calendly: number
          conversaciones_menos_5: number
          conversaciones_nuevas: number
          conversaciones_totales: number
          conversaciones_un_mensaje: number
          mensajes_bot: number
          mensajes_sistema: number
          mensajes_totales: number
          mensajes_usuario: number
        }[]
      }
      obtener_modelos_por_tipo: { Args: { p_tipo: string }; Returns: Json }
      obtener_secreto_automatizacion: {
        Args: { p_nombre: string }
        Returns: string
      }
      orquestador_mensajes_entrantes: {
        Args: {
          p_canal?: string
          p_contenido: string
          p_metadata?: Json
          p_telefono: string
          p_tipo?: string
        }
        Returns: Json
      }
      preview_calificacion_existentes: {
        Args: never
        Returns: {
          cita_id: number
          contacto_id: number
          estado_actual: string
          estado_que_tendria: string
          fecha_cita: string
          nombre_contacto: string
          pregunta_elegibilidad: string
          seria_actualizado: boolean
        }[]
      }
      preview_dynamic_audience: {
        Args: {
          p_appointment_status?: string
          p_empresa_id: number
          p_limit?: number
          p_portfolio_status?: string
        }
        Returns: {
          apellido: string
          email: string
          id: number
          nombre: string
          telefono: string
        }[]
      }
      preview_transfer_contacts_between_team_members: {
        Args: {
          p_eligible_team_member_ids?: number[]
          p_empresa_id: number
          p_from_team_member_id: number
          p_to_team_member_id?: number
          p_transfer_mode?: string
        }
        Returns: {
          eligible_team_members_count: number
          future_appointments_count: number
          principal_contacts_count: number
          round_robin_distribution: Json
          secondary_collaborator_count: number
          secondary_observer_count: number
          target_existing_assignment_merges_count: number
        }[]
      }
      reactivate_expired_pauses: { Args: never; Returns: number }
      reasignar_citas_asesores_sin_aceptar: {
        Args: { p_empresa_id?: number }
        Returns: {
          citas_encontradas: number
          citas_reasignadas: number
          empresas_procesadas: number
        }[]
      }
      reasignar_contacto_sin_grant_id: {
        Args: { p_contacto_id: number }
        Returns: {
          message: string
          nuevo_asesor_email: string
          nuevo_asesor_id: number
          nuevo_asesor_nombre: string
          nuevo_grant_id: string
          success: boolean
        }[]
      }
      reasignar_contactos_sin_asesor: {
        Args: { p_empresa_id?: number }
        Returns: {
          contactos_reasignados: number
          empresas_procesadas: number
          total_contactos_sin_asesor: number
        }[]
      }
      receive_chatbot_message: {
        Args: {
          p_chatbot_id: number
          p_contenido: string
          p_external_conversation_id: string
          p_external_message_id?: string
          p_external_user_id: string
          p_external_user_name: string
          p_external_user_phone: string
          p_metadata?: Json
          p_tipo?: string
        }
        Returns: Json
      }
      reconstruct_json_from_indexed: { Args: { data: Json }; Returns: Json }
      refresh_mv_task_current_state: { Args: never; Returns: undefined }
      registrar_actividad: {
        Args: {
          p_accion: string
          p_agente_id?: number
          p_contacto_id?: number
          p_datos_antes?: Json
          p_datos_despues?: Json
          p_descripcion?: string
          p_empresa_id?: number
          p_entidad_id?: string
          p_entidad_tipo?: string
          p_tipo: string
          p_usuario_id?: string
        }
        Returns: number
      }
      reintentar_contacto_drive_cliente: {
        Args: { p_contacto_id: number }
        Returns: number
      }
      reintentar_contactos_cliente_sin_url_drive: {
        Args: { p_limite?: number }
        Returns: number
      }
      relacionar_usuarios_contactos: { Args: never; Returns: undefined }
      reorder_funnel_stages: {
        Args: { p_enterprise_id: number; p_stage_ids: number[] }
        Returns: boolean
      }
      route_conversation_to_agent: {
        Args: { p_chatbot_id: number; p_empresa_id: number }
        Returns: number
      }
      rpc_kapso_healthcheck: {
        Args: never
        Returns: {
          ok: boolean
        }[]
      }
      rpc_persist_kapso_message: {
        Args: {
          p_contact_id: number
          p_contenido: string
          p_conversation_id: number
          p_empresa_id: number
          p_external_message_id: string
          p_fingerprint: string
          p_idempotency_key: string
          p_is_inbound: boolean
          p_message_timestamp: string
          p_metadata: Json
          p_remitente: string
          p_status: string
          p_tipo: string
        }
        Returns: {
          inserted: boolean
          message_id: number
        }[]
      }
      rpc_prepare_kapso_context: {
        Args: {
          p_contact_name: string
          p_contact_phone: string
          p_default_canal: string
          p_external_conversation_id: string
          p_message_direction: string
          p_message_timestamp: string
          p_phone_number_id: string
          p_receiver_phone: string
          p_subscriber_id: string
        }
        Returns: {
          agent_id: number
          contact_id: number
          conversation_id: number
          conversation_message_count: number
          empresa_id: number
          is_new_contact: boolean
          is_new_conversation: boolean
          number_id: number
          number_kapso_id: string
        }[]
      }
      search_contacts_by_metadata: {
        Args: {
          p_enterprise_id: number
          p_limit?: number
          p_search_term: string
        }
        Returns: {
          id: number
          matched_value: string
        }[]
      }
      search_contacts_fuzzy: {
        Args: {
          p_enterprise_id: number
          p_limit?: number
          p_search_query: string
          p_similarity_threshold?: number
        }
        Returns: {
          apellido: string
          created_at: string
          email: string
          empresa_id: number
          es_calificado: string
          estado: string
          etapa_embudo: number
          id: number
          is_active: boolean
          match_type: string
          metadata: Json
          nombre: string
          origen: string
          paused_until: string
          similarity_score: number
          team_humano_id: number
          telefono: string
          ultima_interaccion: string
          updated_at: string
        }[]
      }
      search_contacts_optimized: {
        Args: {
          p_enterprise_id: number
          p_limit?: number
          p_search_query: string
        }
        Returns: {
          apellido: string
          created_at: string
          email: string
          empresa_id: number
          es_calificado: string
          estado: string
          etapa_embudo: number
          id: number
          is_active: boolean
          matched_sources: string[]
          metadata: Json
          nombre: string
          origen: string
          paused_until: string
          relevance_score: number
          team_humano_id: number
          telefono: string
          ultima_interaccion: string
          updated_at: string
        }[]
      }
      send_chatbot_response: {
        Args: {
          p_contenido: string
          p_conversation_id: number
          p_metadata?: Json
          p_tipo?: string
        }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sync_campaign_enrollments: {
        Args: { p_campana_id?: number; p_empresa_id?: number }
        Returns: {
          campana_id: number
          campana_nombre: string
          nuevos_inscritos: number
        }[]
      }
      task_current_state: {
        Args: never
        Returns: {
          age_days: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          escalation_count: number | null
          event_count: number | null
          id: string | null
          last_event_at: string | null
          last_inbound_at: string | null
          last_outbound_at: string | null
          metadata: Json | null
          owner_email: string | null
          priority: string | null
          project_id: string | null
          status: string | null
          title: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "mv_task_current_state"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      training_update_streak: {
        Args: { p_team_member_id: number }
        Returns: undefined
      }
      transfer_contacts_between_team_members: {
        Args: {
          p_actor_team_member_id?: number
          p_collaborator_strategy?: string
          p_eligible_team_member_ids?: number[]
          p_empresa_id: number
          p_from_team_member_id: number
          p_observer_strategy?: string
          p_to_team_member_id?: number
          p_transfer_mode?: string
        }
        Returns: {
          collaborator_assignments_reassigned: number
          collaborator_assignments_removed: number
          collaborator_contact_ids: number[]
          eligible_team_members_count: number
          future_appointment_participants_added: number
          observer_assignments_reassigned: number
          observer_assignments_removed: number
          principal_contact_ids: number[]
          principal_contacts_transferred: number
          round_robin_distribution: Json
          target_existing_assignment_merges: number
        }[]
      }
      unaccent: { Args: { "": string }; Returns: string }
      update_agent_direct: {
        Args: { agent_id: number; new_nombre: string; new_rol: string }
        Returns: Json
      }
      update_enrollment_after_send: {
        Args: { p_enrollment_id: number; p_success?: boolean }
        Returns: boolean
      }
      urpe_vault_create_secret: {
        Args: {
          secret_description?: string
          secret_name: string
          secret_value: string
        }
        Returns: string
      }
      urpe_vault_read_secret: { Args: { secret_id: string }; Returns: string }
      urpe_vault_update_secret: {
        Args: { new_value: string; secret_id: string }
        Returns: undefined
      }
    }
    Enums: {
      finanza_estado: "activo" | "pagado" | "vencido" | "cancelado"
      finanza_tipo: "ingreso" | "egreso" | "prestamo" | "cartera"
      plan_periodo: "weekly" | "monthly" | "yearly"
      rol_usuario: "dueño" | "administrador" | "operador"
      suscripcion_estado:
        | "active"
        | "paused"
        | "canceled"
        | "expired"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      finanza_estado: ["activo", "pagado", "vencido", "cancelado"],
      finanza_tipo: ["ingreso", "egreso", "prestamo", "cartera"],
      plan_periodo: ["weekly", "monthly", "yearly"],
      rol_usuario: ["dueño", "administrador", "operador"],
      suscripcion_estado: ["active", "paused", "canceled", "expired", "failed"],
    },
  },
} as const
