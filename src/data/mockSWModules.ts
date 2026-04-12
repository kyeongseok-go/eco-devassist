import type { SWModule } from '../types';

export const swModules: SWModule[] = [
  {
    id: 'ballistic-calc',
    name: '탄도 계산 모듈',
    description: '포탄의 탄도 궤적 계산, 사거리/고도/풍향 보정',
    language: 'C',
    filePath: '/src/fcs/ballistic/ballistic_calc.c',
    dependencies: ['sensor-fusion', 'safety-interlock'],
    relatedBOMItems: ['ASM-001', 'SUB-001'],
    testCases: ['TC-BC-001', 'TC-BC-002', 'TC-BC-003'],
    lastModified: '2025-12-15',
    author: '김탄도',
    codeSnippet: `#define MAX_RANGE 40000  // 최대 사거리 (m)
#define MIN_RANGE 500   // 최소 사거리 (m)
#define MAX_ELEVATION 70 // 최대 포각 (도)

typedef struct {
    double range;      // 사거리 (m)
    double elevation;  // 포각 (도)
    double azimuth;    // 방위각 (도)
    double windSpeed;  // 풍속 (m/s)
    double windDir;    // 풍향 (도)
    double temperature; // 기온 (°C)
    double pressure;   // 기압 (hPa)
} BallisticParams;

int calculate_trajectory(BallisticParams *params, TrajectoryResult *result) {
    if (params->range > MAX_RANGE || params->range < MIN_RANGE) {
        return ERR_RANGE_OUT_OF_BOUNDS;
    }
    if (params->elevation > MAX_ELEVATION || params->elevation < 0) {
        return ERR_ELEVATION_INVALID;
    }
    // 탄도 궤적 계산 로직
    double drag_coeff = get_drag_coefficient(params->temperature, params->pressure);
    result->flight_time = compute_flight_time(params->range, params->elevation, drag_coeff);
    result->impact_point = compute_impact(params, drag_coeff);
    result->cep = compute_cep(params, result->impact_point);
    return SUCCESS;
}`,
  },
  {
    id: 'fire-control',
    name: '사격통제 모듈',
    description: '사격 가능 판단, 발사 시퀀스 제어',
    language: 'C',
    filePath: '/src/fcs/control/fire_control.c',
    dependencies: ['ballistic-calc', 'safety-interlock', 'sensor-fusion'],
    relatedBOMItems: ['ASM-003', 'SUB-001'],
    testCases: ['TC-FC-001', 'TC-FC-002'],
    lastModified: '2025-11-20',
    author: '이사격',
    codeSnippet: `#include "ballistic_calc.h"
#include "safety_interlock.h"

typedef enum {
    FIRE_READY,
    FIRE_NOT_READY,
    FIRE_INHIBITED,
    FIRE_SAFETY_BLOCK
} FireStatus;

FireStatus check_fire_readiness(TargetData *target, SystemStatus *sys) {
    if (!safety_check_passed(sys)) {
        return FIRE_SAFETY_BLOCK;
    }
    if (target->range > MAX_RANGE || target->range < MIN_RANGE) {
        return FIRE_NOT_READY;
    }
    if (!sensor_data_valid(sys->sensor_status)) {
        return FIRE_NOT_READY;
    }
    return FIRE_READY;
}`,
  },
  {
    id: 'safety-interlock',
    name: '안전 연동 모듈',
    description: '발사 안전장치 상태 감시 및 연동 제어',
    language: 'C',
    filePath: '/src/fcs/safety/safety_interlock.c',
    dependencies: ['emergency-stop'],
    relatedBOMItems: ['ASM-002', 'SUB-001'],
    testCases: ['TC-SI-001', 'TC-SI-002', 'TC-SI-003', 'TC-SI-004'],
    lastModified: '2025-10-30',
    author: '박안전',
    codeSnippet: `#define SAFE_DISTANCE_MIN 2000   // 최소 안전 거리 (m)
#define SAFE_ELEVATION_MIN 5    // 최소 안전 포각 (도)

typedef struct {
    bool barrel_clear;      // 포구 장애물 없음
    bool breech_locked;     // 포미 잠금
    bool crew_clear;        // 승무원 안전 위치
    bool ammo_armed;        // 탄약 장전 완료
    double safe_distance;   // 안전 거리
} SafetyStatus;

bool safety_check_passed(SafetyStatus *status) {
    if (!status->barrel_clear) return false;
    if (!status->breech_locked) return false;
    if (!status->crew_clear) return false;
    if (status->safe_distance < SAFE_DISTANCE_MIN) return false;
    return true;
}`,
  },
  {
    id: 'emergency-stop',
    name: '비상 정지 모듈',
    description: '비상 상황 시 즉시 발사 중단 및 시스템 안전 모드 전환',
    language: 'C',
    filePath: '/src/fcs/safety/emergency_stop.c',
    dependencies: [],
    relatedBOMItems: ['ASM-002'],
    testCases: ['TC-ES-001', 'TC-ES-002'],
    lastModified: '2025-09-15',
    author: '박안전',
    codeSnippet: `void emergency_stop_handler(void) {
    disable_all_firing_circuits();
    set_system_mode(MODE_SAFE);
    log_emergency_event(get_timestamp(), get_system_state());
    notify_crew("EMERGENCY STOP ACTIVATED");
}`,
  },
  {
    id: 'sensor-fusion',
    name: '센서 융합 모듈',
    description: '다중 센서 데이터 융합 및 표적 정보 통합',
    language: 'C++',
    filePath: '/src/fcs/sensor/sensor_fusion.cpp',
    dependencies: ['thermal-interface', 'target-tracking'],
    relatedBOMItems: ['ASM-004', 'ASM-005', 'SUB-002'],
    testCases: ['TC-SF-001', 'TC-SF-002', 'TC-SF-003'],
    lastModified: '2025-12-01',
    author: '최센서',
    codeSnippet: `class SensorFusion {
    void fuseData(const ThermalData& thermal, const LaserData& laser,
                  const RadarData& radar, FusedTarget& output) {
        // 칼만 필터 기반 센서 융합
        KalmanFilter kf(STATE_DIM, MEAS_DIM);
        kf.predict(dt);
        kf.update(thermal.toMeasurement());
        kf.update(laser.toMeasurement());
        output.position = kf.getState();
        output.confidence = compute_confidence(thermal, laser, radar);
    }
};`,
  },
  {
    id: 'target-tracking',
    name: '표적 추적 모듈',
    description: '표적 탐지, 추적, 예측 경로 계산',
    language: 'C++',
    filePath: '/src/fcs/sensor/target_tracking.cpp',
    dependencies: ['sensor-fusion'],
    relatedBOMItems: ['SUB-002'],
    testCases: ['TC-TT-001', 'TC-TT-002'],
    lastModified: '2025-11-10',
    author: '최센서',
    codeSnippet: `class TargetTracker {
    TrackResult track(const FusedTarget& target) {
        updateTrackHistory(target);
        auto predicted = predictPath(target, PREDICTION_HORIZON);
        return { target.id, predicted, computeTrackQuality() };
    }
};`,
  },
  {
    id: 'thermal-interface',
    name: '열상 센서 인터페이스',
    description: '열상 카메라 하드웨어 인터페이스 및 영상 데이터 수집',
    language: 'C',
    filePath: '/src/fcs/sensor/thermal_interface.c',
    dependencies: ['image-processing'],
    relatedBOMItems: ['ASM-004'],
    testCases: ['TC-TI-001'],
    lastModified: '2025-08-20',
    author: '정영상',
    codeSnippet: `int thermal_capture_frame(ThermalFrame *frame) {
    if (!hw_check_sensor_ready()) return ERR_SENSOR_NOT_READY;
    raw_data_t raw = hw_read_sensor_buffer();
    frame->data = apply_nuc_correction(raw);
    frame->timestamp = get_high_res_time();
    return SUCCESS;
}`,
  },
  {
    id: 'image-processing',
    name: '영상 처리 모듈',
    description: '열상 영상 전처리, 표적 탐지 알고리즘',
    language: 'C++',
    filePath: '/src/fcs/sensor/image_processing.cpp',
    dependencies: [],
    relatedBOMItems: ['ASM-004'],
    testCases: ['TC-IP-001', 'TC-IP-002'],
    lastModified: '2025-10-05',
    author: '정영상',
    codeSnippet: `std::vector<DetectedObject> detect_targets(const ThermalFrame& frame) {
    auto enhanced = apply_histogram_eq(frame);
    auto blobs = blob_detection(enhanced, THERMAL_THRESHOLD);
    return classify_objects(blobs, model_weights);
}`,
  },
  {
    id: 'comm-protocol',
    name: '통신 프로토콜 모듈',
    description: 'MIL-STD-1553B 데이터 버스 통신 프로토콜',
    language: 'C',
    filePath: '/src/fcs/comm/comm_protocol.c',
    dependencies: ['encryption'],
    relatedBOMItems: ['ASM-007', 'SUB-003'],
    testCases: ['TC-CP-001'],
    lastModified: '2025-07-15',
    author: '한통신',
    codeSnippet: `int send_mil1553_message(uint8_t rt_addr, uint8_t subaddr,
                           uint16_t *data, size_t word_count) {
    CommandWord cw = build_command_word(rt_addr, subaddr, word_count, TX);
    if (!bus_available()) return ERR_BUS_BUSY;
    return transmit(cw, data, word_count);
}`,
  },
  {
    id: 'data-link',
    name: '데이터링크 모듈',
    description: '전술 데이터링크 (Link-K) 통신 관리',
    language: 'C',
    filePath: '/src/fcs/comm/data_link.c',
    dependencies: ['comm-protocol', 'encryption'],
    relatedBOMItems: ['ASM-006', 'SUB-003'],
    testCases: ['TC-DL-001'],
    lastModified: '2025-09-01',
    author: '한통신',
    codeSnippet: `int send_tactical_data(TacticalMessage *msg) {
    uint8_t encrypted[MAX_MSG_SIZE];
    int len = encrypt_message(msg->payload, msg->length, encrypted);
    return send_mil1553_message(msg->dest_rt, TACTICAL_SUBADDR,
                                (uint16_t*)encrypted, len/2);
}`,
  },
  {
    id: 'encryption',
    name: '암호화 모듈',
    description: '군용 통신 암호화/복호화 (KMS 연동)',
    language: 'C',
    filePath: '/src/fcs/comm/encryption.c',
    dependencies: [],
    relatedBOMItems: ['ASM-006', 'SUB-003'],
    testCases: ['TC-EN-001', 'TC-EN-002'],
    lastModified: '2025-06-20',
    author: '한통신',
    codeSnippet: `int encrypt_message(const uint8_t *plain, size_t len, uint8_t *cipher) {
    CryptoKey *key = kms_get_current_key();
    if (!key || key_expired(key)) return ERR_KEY_INVALID;
    return aes256_gcm_encrypt(key, plain, len, cipher);
}`,
  },
];

export function getModuleById(id: string): SWModule | undefined {
  return swModules.find((m) => m.id === id);
}

export function getModulesByBOMItem(bomItemId: string): SWModule[] {
  return swModules.filter((m) => m.relatedBOMItems.includes(bomItemId));
}
