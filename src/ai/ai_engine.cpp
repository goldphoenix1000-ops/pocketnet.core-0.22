#include <ai/ai_engine.h>

#include <fs.h>
#include <logging.h>
#include <util/system.h>

#include <mutex>

// #include <llama.h>   // подключить при сборке с llama.cpp (см. CMake/Makefile.am)

namespace {

std::mutex g_ai_mutex;
AiAgentSlot g_wolf;
AiAgentSlot g_leshy;

/**
 * ХУК: свободная видеопамять в байтах, либо 0, если определить не удалось.
 * NVIDIA: nvmlDeviceGetMemoryInfo(); AMD/Intel: Vulkan VK_EXT_memory_budget; Apple: Metal recommendedMaxWorkingSetSize.
 */
uint64_t QueryFreeVramBytes()
{
    return 0; // ЗАМЕНИТЬ реализацией под ваше железо; 0 = "неизвестно" -> запуск блокируется
}

/** Готовим один слот: проверяем файл и VRAM, затем поднимаем поток. */
bool PrepareSlot(AiAgentSlot& slot, const std::string& name, const fs::path& dir, const char* file, uint64_t freeVram)
{
    slot.name = name;
    slot.modelPath = (dir / file).string();
    slot.ready = false;

    if (!fs::exists(slot.modelPath)) {
        slot.lastError = "нет файла весов: " + slot.modelPath;
        LogPrintf("AI: %s: %s\n", name, slot.lastError);
        return false;
    }

    if (freeVram < AiEngineConfig::MIN_VRAM_BYTES) {
        slot.lastError = "недостаточно VRAM";
        if (name == "Серый Волк") {
            LogPrintf("Внимание: Мало Света в Ларце ноды для Серого Волка\n");
        } else {
            LogPrintf("Внимание: Мало Света в Ларце ноды для %s\n", name);
        }
        return false;
    }

    slot.stop = false;
    slot.worker = std::thread([&slot]() {
        // Здесь: llama_backend_init(); llama_load_model_from_file(...); llama_new_context_with_model(...);
        // Параметры воспроизводимости: seed = ASGARD_SEED, выборка greedy (temp = 0),
        // n_ctx = CONTEXT_TOKENS, n_predict = MAX_NEW_TOKENS.
        // Цикл: ждать задачу из очереди, выполнить инференс, вернуть результат; выходить по slot.stop.
        while (!slot.stop) {
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
        // llama_free(ctx); llama_free_model(model); llama_backend_free();
    });
    slot.ready = true;
    LogPrintf("AI: агент '%s' готов (%s)\n", name, slot.modelPath);
    return true;
}

} // namespace

bool InitializeLocalAiAgents()
{
    std::lock_guard<std::mutex> lock(g_ai_mutex);

    // Только для нод Бояр: включается флагом -aiagents=1
    if (!gArgs.GetBoolArg("-aiagents", false)) {
        LogPrintf("AI: локальные агенты выключены (-aiagents=0)\n");
        return false;
    }

    const fs::path dir = gArgs.IsArgSet("-aimodeldir") ? fs::path(gArgs.GetArg("-aimodeldir", "")) : GetDataDir() / "ai";
    const uint64_t freeVram = QueryFreeVramBytes();

    if (freeVram == 0) {
        LogPrintf("AI: объём VRAM определить не удалось, запуск заблокирован\n");
        return false;
    }

    // Подготовка идёт по очереди; каждой модели нужен свой запас VRAM.
    // Если хватает только на одну, поднимается Серый Волк, а Леший пропускается.
    bool wolf = PrepareSlot(g_wolf, "Серый Волк", dir, AiEngineConfig::WOLF_MODEL_FILE, freeVram);
    const uint64_t leftover = wolf ? (freeVram > AiEngineConfig::MIN_VRAM_BYTES ? freeVram - AiEngineConfig::MIN_VRAM_BYTES : 0) : freeVram;
    bool leshy = PrepareSlot(g_leshy, "Леший", dir, AiEngineConfig::LESHY_MODEL_FILE, leftover);

    return wolf || leshy;
}

void StopLocalAiAgents()
{
    std::lock_guard<std::mutex> lock(g_ai_mutex);
    for (AiAgentSlot* s : {&g_wolf, &g_leshy}) {
        s->stop = true;
        if (s->worker.joinable()) s->worker.join();
        s->ready = false;
    }
}

std::vector<std::pair<std::string, bool>> GetAiAgentStatus()
{
    std::lock_guard<std::mutex> lock(g_ai_mutex);
    return {{"wolf_antispam", g_wolf.ready}, {"leshy_quest", g_leshy.ready}};
}