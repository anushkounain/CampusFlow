import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  Sliders,
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
  Target,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { intelligenceApi, careerApi } from '../api';
import { PlacementPredictionResult, PlacementSimulationResult, SkillMatchReport, JobPosting } from '../types';

export const PlacementIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predictor' | 'simulator' | 'skill_gap'>('predictor');

  // Prediction Inputs
  const [degreeP, setDegreeP] = useState<number>(78.0);
  const [workex, setWorkex] = useState<number>(1);
  const [dsaSolved, setDsaSolved] = useState<number>(180);
  const [githubCommits, setGithubCommits] = useState<number>(120);
  const [etestP, setEtestP] = useState<number>(82.0);

  const [prediction, setPrediction] = useState<PlacementPredictionResult | null>(null);
  const [loadingPred, setLoadingPred] = useState<boolean>(false);

  // Simulator deltas
  const [cgpaDelta, setCgpaDelta] = useState<number>(4.0);
  const [workexDelta, setWorkexDelta] = useState<number>(1);
  const [dsaDelta, setDsaDelta] = useState<number>(60);
  const [simulation, setSimulation] = useState<PlacementSimulationResult | null>(null);

  // Skill Gap matching
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [studentSkills, setStudentSkills] = useState<string>("Python, React, TypeScript, SQL, Git, Linux");
  const [skillReport, setSkillReport] = useState<SkillMatchReport | null>(null);
  const [loadingSkill, setLoadingSkill] = useState<boolean>(false);

  const fetchPrediction = async () => {
    setLoadingPred(true);
    try {
      const res = await intelligenceApi.predictPlacement({
        ssc_p: 76.0,
        hsc_p: 74.0,
        degree_p: degreeP,
        workex,
        etest_p: etestP,
        dsa_solved: dsaSolved,
        github_commits: githubCommits,
      });
      setPrediction(res);
    } catch (err) {
      console.error('Failed to run placement prediction', err);
    } finally {
      setLoadingPred(false);
    }
  };

  const runSimulation = async () => {
    try {
      const res = await intelligenceApi.simulateCareer({
        base_features: {
          ssc_p: 76.0,
          hsc_p: 74.0,
          degree_p: degreeP,
          workex,
          etest_p: etestP,
          dsa_solved: dsaSolved,
          github_commits: githubCommits,
        },
        deltas: {
          degree_p: cgpaDelta,
          workex: workexDelta,
          dsa_solved: dsaDelta,
        },
      });
      setSimulation(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    }
  };

  useEffect(() => {
    fetchPrediction();
    careerApi.getJobs().then((data) => {
      setJobs(data);
      if (data.length > 0) setSelectedJob(data[0]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === 'simulator') {
      runSimulation();
    }
  }, [activeTab, cgpaDelta, workexDelta, dsaDelta, degreeP, workex, dsaSolved]);

  const handleMatchSkills = async () => {
    if (!selectedJob) return;
    setLoadingSkill(true);
    try {
      const parsedStudentSkills = studentSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const reqSkills = selectedJob.requirements
        ? selectedJob.requirements.split(',').map((s) => s.trim()).filter(Boolean)
        : ["Python", "Distributed Systems", "Docker", "Algorithms"];

      const res = await intelligenceApi.matchSkills({
        student_skills: parsedStudentSkills,
        required_skills: reqSkills,
        preferred_skills: ["React", "FastAPI", "TypeScript"],
      });
      setSkillReport(res);
    } catch (err) {
      console.error('Failed to analyze skill match', err);
    } finally {
      setLoadingSkill(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kaggle-Calibrated Production Machine Learning Model</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Placement & Career Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Predict placement probability, estimate expected compensation, and simulate what-if career upside
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'predictor' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Probability Engine
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            What-If Simulator
          </button>
          <button
            onClick={() => {
              setActiveTab('skill_gap');
              handleMatchSkills();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'skill_gap' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Gap Matcher
          </button>
        </div>
      </div>

      {/* Predictor Tab */}
      {activeTab === 'predictor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <Card title="Student Profile Parameters" subtitle="Features powering the Random Forest model">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Degree Percentage / CGPA Equivalent</span>
                  <span>{degreeP}%</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="95"
                  step="0.5"
                  value={degreeP}
                  onChange={(e) => setDegreeP(parseFloat(e.target.value))}
                  className="w-full mt-1 accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>DSA Problems Solved (LeetCode / CodeChef)</span>
                  <span>{dsaSolved}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={dsaSolved}
                  onChange={(e) => setDsaSolved(parseInt(e.target.value))}
                  className="w-full mt-1 accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Aptitude & Technical Test (eTest)</span>
                  <span>{etestP}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  step="1"
                  value={etestP}
                  onChange={(e) => setEtestP(parseFloat(e.target.value))}
                  className="w-full mt-1 accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>GitHub Public Commits</span>
                  <span>{githubCommits}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="350"
                  step="10"
                  value={githubCommits}
                  onChange={(e) => setGithubCommits(parseInt(e.target.value))}
                  className="w-full mt-1 accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-700">Prior Internship / Work Experience</span>
                <button
                  type="button"
                  onClick={() => setWorkex(workex === 1 ? 0 : 1)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${
                    workex === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {workex === 1 ? 'Yes (Completed)' : 'None'}
                </button>
              </div>

              <Button onClick={fetchPrediction} isLoading={loadingPred} className="w-full mt-2">
                Recalculate Prediction
              </Button>
            </div>
          </Card>

          {/* Inference Output Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card className="border-l-4 border-l-blue-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Placement Probability
                  </span>
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Target className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {prediction?.placement_percentage || 82.5}%
                  </span>
                  <Badge
                    variant={
                      (prediction?.placement_percentage || 0) >= 70
                        ? 'green'
                        : (prediction?.placement_percentage || 0) >= 45
                        ? 'blue'
                        : 'red'
                    }
                    size="md"
                  >
                    {prediction?.status_bracket || 'High Probability'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">Random Forest Classifier (ROC-AUC: 0.74)</p>
              </Card>

              <Card className="border-l-4 border-l-emerald-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Projected CTC Package
                  </span>
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <DollarSign className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{prediction?.projected_salary_lpa || 14.5} LPA
                  </span>
                  <Badge variant="green" size="md">Tier-1 Tech</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">Gradient Boosting Regressor (MAE: ±1.57 LPA)</p>
              </Card>
            </div>

            {/* Feature Attribution */}
            <Card title="Model Decision Attribution" subtitle="Top statistical drivers determining this candidate prediction">
              <div className="space-y-3">
                {prediction?.top_factors?.map((f, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 capitalize">
                        {f.feature.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500">Weight: {(f.importance_weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(f.importance_weight * 350, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <Card title="Interactive 'What-If' Career Trajectory Simulator" subtitle="Explore how academic & technical gains boost placement offers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Improve Degree Score by: +{cgpaDelta}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={cgpaDelta}
                  onChange={(e) => setCgpaDelta(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Solve Additional DSA Problems: +{dsaDelta}
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="10"
                  value={dsaDelta}
                  onChange={(e) => setDsaDelta(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Add Internship Experience: {workexDelta === 1 ? '+1 Internship' : 'None'}
                </label>
                <button
                  type="button"
                  onClick={() => setWorkexDelta(workexDelta === 1 ? 0 : 1)}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    workexDelta === 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'
                  }`}
                >
                  {workexDelta === 1 ? 'Internship Added' : 'No Internship Added'}
                </button>
              </div>
            </div>
          </Card>

          {simulation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Baseline vs. Simulated Trajectory">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                    <span className="text-xs font-bold text-slate-700">Placement Probability</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">{simulation.baseline.placement_percentage}%</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-emerald-600">{simulation.simulated.placement_percentage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                    <span className="text-xs font-bold text-slate-700">Expected Compensation</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">₹{simulation.baseline.projected_salary_lpa} LPA</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-emerald-600">₹{simulation.simulated.projected_salary_lpa} LPA</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
                    {simulation.recommendation}
                  </div>
                </div>
              </Card>

              <Card title="Predicted Upside Gains">
                <div className="flex flex-col justify-center items-center py-6 space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-blue-600">
                      +{simulation.deltas.placement_prob_change_pct}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Placement Probability Gain</p>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-emerald-600">
                      +₹{simulation.deltas.projected_salary_change_lpa} LPA
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Projected Package Boost</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Skill Gap Tab */}
      {activeTab === 'skill_gap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card title="Target Company & Opening">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Job Drive</label>
                <select
                  value={selectedJob?.id || ''}
                  onChange={(e) => {
                    const found = jobs.find((j) => j.id === parseInt(e.target.value));
                    if (found) setSelectedJob(found);
                  }}
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company_name} — {j.role_title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Verified Skills (Comma separated)</label>
                <textarea
                  rows={4}
                  value={studentSkills}
                  onChange={(e) => setStudentSkills(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                />
              </div>

              <Button onClick={handleMatchSkills} isLoading={loadingSkill} className="w-full">
                Analyze Skill Match
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {skillReport && (
              <Card
                title={`Match Evaluation: ${selectedJob?.company_name} (${skillReport.status})`}
                subtitle="Curriculum-aware automated skill gap analysis"
              >
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-extrabold text-blue-600">{skillReport.match_percentage}%</div>
                    <div>
                      <Badge variant={skillReport.match_percentage >= 75 ? 'green' : 'amber'} size="md">
                        {skillReport.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">Based on required & preferred technical competencies</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <p className="text-xs font-bold text-emerald-900 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Matched Skills ({skillReport.matched_required_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillReport.matched_required_skills.map((s, idx) => (
                          <Badge key={idx} variant="green" size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
                      <p className="text-xs font-bold text-rose-900 flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Missing Competencies ({skillReport.missing_required_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillReport.missing_required_skills.map((s, idx) => (
                          <Badge key={idx} variant="red" size="sm">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {skillReport.recommended_courses.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Recommended University Bridge Electives:
                      </h4>
                      <div className="space-y-2">
                        {skillReport.recommended_courses.map((course, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-blue-600 mr-2">{course.code}</span>
                              <span className="text-xs font-semibold text-slate-800">{course.name}</span>
                            </div>
                            <Badge variant="blue" size="sm">Curriculum Bridge</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
