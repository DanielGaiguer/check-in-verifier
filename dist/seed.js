"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/seed.ts
var db_1 = require("@/db"); // seu client do Drizzle
var schema_1 = require("@/db/schema");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, lab1Id, lab2Id, _b, place1Id, place2Id, _c, person1Id, person2Id, _d, problem1Id, problem2Id, checkin1Id, checkinItem1Id, checkinItemProblem1Id;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("Iniciando seed...");
                    _a = [
                        "11111111-1111-1111-1111-111111111111",
                        "22222222-2222-2222-2222-222222222222",
                    ], lab1Id = _a[0], lab2Id = _a[1];
                    return [4 /*yield*/, db_1.db.insert(schema_1.laboratories).values([
                            { id: lab1Id, name: "Laboratório Central" },
                            { id: lab2Id, name: "Laboratório Secundário" },
                        ])];
                case 1:
                    _e.sent();
                    _b = [
                        "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
                        "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
                    ], place1Id = _b[0], place2Id = _b[1];
                    return [4 /*yield*/, db_1.db.insert(schema_1.places).values([
                            { id: place1Id, labId: lab1Id, name: "Bancada A", sortOrder: 1 },
                            { id: place2Id, labId: lab1Id, name: "Bancada B", sortOrder: 2 },
                        ])];
                case 2:
                    _e.sent();
                    _c = [
                        "p1111111-1111-1111-1111-111111111111",
                        "p2222222-2222-2222-2222-222222222222",
                    ], person1Id = _c[0], person2Id = _c[1];
                    return [4 /*yield*/, db_1.db.insert(schema_1.people).values([
                            { id: person1Id, name: "Alice" },
                            { id: person2Id, name: "Bob" },
                        ])];
                case 3:
                    _e.sent();
                    _d = [
                        "pr111111-1111-1111-1111-111111111111",
                        "pr222222-2222-2222-2222-222222222222",
                    ], problem1Id = _d[0], problem2Id = _d[1];
                    return [4 /*yield*/, db_1.db.insert(schema_1.problems).values([
                            { id: problem1Id, name: "Lâmpada Quebrada", description: "Lâmpada não funciona" },
                            { id: problem2Id, name: "Mesa Suja", description: "Mesa com resíduos" },
                        ])];
                case 4:
                    _e.sent();
                    // 5️⃣ PlaceProblems
                    return [4 /*yield*/, db_1.db.insert(schema_1.placeProblems).values([
                            { placeId: place1Id, problemId: problem1Id },
                            { placeId: place2Id, problemId: problem2Id },
                        ])];
                case 5:
                    // 5️⃣ PlaceProblems
                    _e.sent();
                    checkin1Id = ["c1111111-1111-1111-1111-111111111111"][0];
                    return [4 /*yield*/, db_1.db.insert(schema_1.checkins).values([
                            {
                                id: checkin1Id,
                                peopleId: person1Id,
                                date: new Date().toISOString().slice(0, 10), // '2026-03-09'
                            },
                        ])
                        // 7️⃣ CheckinItems
                    ];
                case 6:
                    _e.sent();
                    checkinItem1Id = ["ci111111-1111-1111-1111-111111111111"][0];
                    return [4 /*yield*/, db_1.db.insert(schema_1.checkinItems).values([
                            {
                                id: checkinItem1Id,
                                checkinId: checkin1Id,
                                placeId: place1Id,
                                status: "organized",
                                observation: "Tudo OK",
                            },
                        ])];
                case 7:
                    _e.sent();
                    checkinItemProblem1Id = ["cip11111-1111-1111-1111-111111111111"][0];
                    return [4 /*yield*/, db_1.db.insert(schema_1.checkinItemsProblems).values([
                            {
                                id: checkinItemProblem1Id,
                                checkinItemId: checkinItem1Id,
                                problemId: problem1Id,
                            },
                        ])];
                case 8:
                    _e.sent();
                    // 9️⃣ CheckinItemPhotos
                    return [4 /*yield*/, db_1.db.insert(schema_1.checkinItemPhotos).values([
                            {
                                id: "ph111111-1111-1111-1111-111111111111",
                                checkinItemProblemId: checkinItemProblem1Id,
                                photoUrl: "https://placekitten.com/200/300",
                                sortOrder: 1,
                            },
                        ])];
                case 9:
                    // 9️⃣ CheckinItemPhotos
                    _e.sent();
                    console.log("Seed concluído!");
                    return [2 /*return*/];
            }
        });
    });
}
seed()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return process.exit(0); });
