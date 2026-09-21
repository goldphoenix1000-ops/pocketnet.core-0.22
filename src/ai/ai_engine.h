#ifndef BERESTA_AI_ENGINE_H
#define BERESTA_AI_ENGINE_H

#include <atomic>
#include <cstdint>
#include <memory>
#include <string>
#include <thread>
#include <vector>

/** Конфигурация локальных ИИ-агентов (Asgard_Prompt_Anchor). */
class AiEngineConfig
{
public:
    /** Принудительный температурный лимит (Asgard). Для воспроизводимости движок использует greedy. */
    static constexpr double ASGARD_TEMPERATURE = 0.05;

    /** Фиксированное зерно генератора: одинаковый вход даёт одинаковый выход на одной сборке. */
    static constexpr uint32_t ASGARD_SEED = 42;

    /** Минимум видеопамяти на одну модель: 6 ГБ. */
    static constexpr uint64_t MIN_VRAM_BYTES = 6ULL * 1024 * 1024 * 1024;

    /** Файлы весов (GGUF, Q4_K_M). Каталог задаётся -aimodeldir. */
    static constexpr const char* WOLF_MODEL_FILE  = "mistral-7b-q4_k_m.gguf";  //!< Серый Волк (Wolf_AntiSpam)
    static constexpr const char* LESHY_MODEL_FILE = "llama-3-8b-q4_k_m.gguf";  //!< Леший (Leshy_Quest_Engine)

    static constexpr int CONTEXT_TOKENS = 2048;
    static constexpr int MAX_NEW_TOKENS = 256;
};

/** Состояние одного агента. */
struct AiAgentSlot
{
    std::string name;
    std::string modelPath;
    bool ready{false};
    std::string lastError;
    std::thread worker;               //!< поток инференса
    std::atomic<bool> stop{false};
};

/** Подготовить агентов на ноде Боярина. Возвращает true, если хотя бы один агент готов. */
bool InitializeLocalAiAgents();

/** Остановить потоки (вызывать при Shutdown). */
void StopLocalAiAgents();

/** Статус для RPC. */
std::vector<std::pair<std::string, bool>> GetAiAgentStatus();

#endif // BERESTA_AI_ENGINE_H