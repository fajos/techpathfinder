// screens/ResumeBuilderScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { useResumeStore } from '../store/resumeStore';
import { useThemeStyles } from '../hooks/useThemeStyles';
import * as Sharing from 'expo-sharing';
import { StorageAccessFramework } from 'expo-file-system';
import { trackScreen, trackEvent } from '../services/analytics';



export default function ResumeBuilderScreen({ route, navigation }) {
    const { career } = route.params || {};
    const { user } = useAuth();
    const { isPremium } = usePremium();
    const { getCurrentProfile } = useUserProfileStore();
    const {
        resumes,
        currentResumeId,
        templates,
        createResume,
        updateSection,
        getCurrentResume,
        setCurrentResume,
        importFromProfile
    } = useResumeStore();

    const { colors } = useThemeStyles();
    const [resume, setResume] = useState(null);
    const [activeSection, setActiveSection] = useState('personal');
    const [editing, setEditing] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const { Paths, File, Directory } = FileSystem;

    console.log('FileSystem API:', Object.keys(FileSystem));


useEffect(() => {
  trackScreen('ResumeBuilderScreen');
  trackEvent('feature_used', { 
    feature: 'resume_builder', 
    career: career
  });
}, [career]);


// Export to Downloads using simple file copy
const exportToDownloads = async (sourceFile, fileName) => {
  try {
    if (Platform.OS === 'android') {
      // Request permission to access Downloads
      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (permissions.granted) {
        const downloadsUri = permissions.directoryUri;
        
        // Create the file in the selected folder (Downloads)
        const newFileUri = await StorageAccessFramework.createFileAsync(
          downloadsUri,
          fileName,
          'application/pdf'
        );
        
        // Read source file as base64
        const content = await sourceFile.base64();
        
        // Write to the new file
        await StorageAccessFramework.writeAsStringAsync(newFileUri, content, {
          encoding: StorageAccessFramework.EncodingType.Base64
        });
        
        Alert.alert('Success', `Saved to Downloads/${fileName}`);
      } else {
        Alert.alert('Permission Denied', 'Cannot save without permission');
      }
    } else {
      // iOS: Use share
      await Sharing.shareAsync(sourceFile.uri);
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert(
      'Save Failed',
      'Could not save to Downloads. Would you like to share the file instead?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: async () => await Sharing.shareAsync(sourceFile.uri)
        }
      ]
    );
  }
};

const saveToDownloads = async (sourceFile, fileName) => {
  try {
    // Request permission to write to Downloads
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    
    if (permissions.granted) {
      const downloadsUri = permissions.directoryUri;
      
      // Create the file in Downloads
      const newFileUri = await StorageAccessFramework.createFileAsync(
        downloadsUri,
        fileName,
        'application/pdf'
      );
      
      // Read source file content
      const content = await sourceFile.base64();
      
      // Write to Downloads
      await StorageAccessFramework.writeAsStringAsync(newFileUri, content, {
        encoding: StorageAccessFramework.EncodingType.Base64
      });
      
      Alert.alert('Success', `Saved to Downloads/${fileName}`);
    }
  } catch (error) {
    console.error('Save error:', error);
    throw error;
  }
};

    useEffect(() => {
        if (user && career) {
            loadOrCreateResume();
        }
    }, [user, career]);

    useEffect(() => {
  console.log('Document directory:', FileSystem.documentDirectory);
}, []);

    const loadOrCreateResume = () => {
        // Check if there's an existing resume for this career
        const existing = resumes.find(r => r.career === career && r.userId === user.uid);

        if (existing) {
            setCurrentResume(existing.id);
            setResume(existing);
        } else {
            // Create new resume
            const newId = createResume(user.uid, career, 'modern');
            const profile = getCurrentProfile();

            // Auto-import from profile
            setTimeout(() => {
                importFromProfile(newId, profile);
                const newResume = getCurrentResume();
                setResume(newResume);
            }, 100);
        }
    };

    // Premium gate
    if (!isPremium) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="lock-closed" size={60} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 20 }]}>
                    Resume Builder
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }]}>
                    Upgrade to Premium to generate tailored resumes for your target career.
                </Text>
                <TouchableOpacity
                    style={[styles.upgradeButton, { backgroundColor: '#4d31f1' }]}
                    onPress={() => navigation.navigate('Premium')}
                >
                    <Text style={styles.upgradeButtonText}>View Premium</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!resume) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const currentTemplate = templates[resume.template];

    const updateField = (section, field, value) => {
        const updatedData = { ...resume.data };

        if (section === 'personal') {
            updatedData.personal[field] = value;
        } else if (section === 'experience' || section === 'projects' || section === 'education') {
            // For array sections, value should be the entire updated array
            updatedData[section] = value;
        } else {
            updatedData[section] = value;
        }

        // Update local state
        setResume({ ...resume, data: updatedData });

        // Update store
        updateSection(resume.id, section, updatedData[section]);
    };

    const addArrayItem = (section, item) => {
        const updatedData = { ...resume.data };
        if (!updatedData[section]) updatedData[section] = [];
        updatedData[section].push(item);

        setResume({ ...resume, data: updatedData });
        updateSection(resume.id, section, updatedData[section]);
    };

    const removeArrayItem = (section, index) => {
        const updatedData = { ...resume.data };
        updatedData[section].splice(index, 1);

        setResume({ ...resume, data: updatedData });
        updateSection(resume.id, section, updatedData[section]);
    };

    const generatePDF = async () => {

        trackEvent('resume_generated', { 
    career: career,
    has_skills: resume.data.skills?.length > 0
  });
        setGeneratingPDF(true);

        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.data.personal.name || 'Resume'} - ${career}</title>
        <style>
          body {
            font-family: ${currentTemplate.fonts.body};
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: ${currentTemplate.colors.text};
            background: ${currentTemplate.colors.background};
          }
          h1 {
            color: ${currentTemplate.colors.primary};
            font-family: ${currentTemplate.fonts.heading};
            margin-bottom: 5px;
          }
          .contact-info {
            color: ${currentTemplate.colors.secondary};
            margin-bottom: 20px;
          }
          .section-title {
            color: ${currentTemplate.colors.primary};
            font-family: ${currentTemplate.fonts.heading};
            border-bottom: 2px solid ${currentTemplate.colors.primary}20;
            padding-bottom: 5px;
            margin-top: 20px;
          }
          .skill-tag {
            display: inline-block;
            background: ${currentTemplate.colors.primary}20;
            color: ${currentTemplate.colors.primary};
            padding: 4px 10px;
            border-radius: 15px;
            margin: 3px;
            font-size: 12px;
          }
          .job-title {
            font-weight: bold;
            color: ${currentTemplate.colors.text};
          }
          .company {
            color: ${currentTemplate.colors.secondary};
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <h1>${resume.data.personal.name || 'Your Name'}</h1>
        <div class="contact-info">
          ${resume.data.personal.email ? `📧 ${resume.data.personal.email}  |  ` : ''}
          ${resume.data.personal.phone ? `📱 ${resume.data.personal.phone}  |  ` : ''}
          ${resume.data.personal.location ? `📍 ${resume.data.personal.location}` : ''}
        </div>
        
        ${resume.data.summary ? `
          <div class="section-title">Professional Summary</div>
          <p>${resume.data.summary}</p>
        ` : ''}
        
        ${resume.data.skills?.length ? `
          <div class="section-title">Skills</div>
          <div>
            ${resume.data.skills.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('')}
          </div>
        ` : ''}
        
        ${resume.data.experience?.length ? `
          <div class="section-title">Experience</div>
          ${resume.data.experience.map(exp => `
            <div style="margin-bottom: 15px;">
              <div class="job-title">${exp.title}</div>
              <div class="company">${exp.company} | ${exp.startDate} - ${exp.endDate || 'Present'}</div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        ` : ''}
        
        ${resume.data.projects?.length ? `
          <div class="section-title">Projects</div>
          ${resume.data.projects.map(proj => `
            <div style="margin-bottom: 10px;">
              <div class="job-title">${proj.name}</div>
              <p>${proj.description}</p>
              ${proj.technologies ? `<div>${proj.technologies}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}
        
        ${resume.data.education?.length ? `
          <div class="section-title">Education</div>
          ${resume.data.education.map(edu => `
            <div style="margin-bottom: 10px;">
              <div class="job-title">${edu.degree}</div>
              <div class="company">${edu.institution} | ${edu.year}</div>
            </div>
          `).join('')}
        ` : ''}
      </body>
    </html>
  `;

      try {
    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });
    const sourceFile = new File(uri);
    
    // Generate unique filename
    const timestamp = new Date().getTime();
    const namePart = resume.data.personal.name?.replace(/\s+/g, '_') || 'resume';
    const careerPart = career.replace(/\s+/g, '_');
    const fileName = `${namePart}_${careerPart}_${timestamp}.pdf`;
    
    // Save to app documents (THIS ALREADY SAVES THE FILE)
    const destFile = new File(Paths.document, fileName);
    await sourceFile.copy(destFile);
    
    console.log('PDF saved to:', destFile.uri);
    
    // Show success with clear next steps
    Alert.alert(
      '✅ Resume Saved!',
      `"${fileName}" has been saved to your device.\n\nYou can view all saved resumes in the "Saved Resumes" section.`,
      [
        {
          text: 'View All Resumes',
          onPress: async () => {
            navigation.navigate('SavedResumes');
          }
        },
        {
          text: 'Share',
          onPress: async () => {
            await Sharing.shareAsync(destFile.uri);
          }
        },
        { text: 'OK', style: 'cancel' }
      ]
    );
    
  } catch (error) {
    console.error('PDF generation error:', error);
    Alert.alert('Error', 'Failed to generate PDF. Please try again.');
  } finally {
    setGeneratingPDF(false);
  }
};
    const renderSection = () => {
        switch (activeSection) {
            case 'personal':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Personal Information</Text>

                        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.name}
                            onChangeText={(text) => updateField('personal', 'name', text)}
                            placeholder="John Doe"
                            placeholderTextColor="#9CA3AF"
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.email}
                            onChangeText={(text) => updateField('personal', 'email', text)}
                            placeholder="john@example.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.phone}
                            onChangeText={(text) => updateField('personal', 'phone', text)}
                            placeholder="(555) 123-4567"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.location}
                            onChangeText={(text) => updateField('personal', 'location', text)}
                            placeholder="San Francisco, CA"
                            placeholderTextColor="#9CA3AF"
                        />

                        <Text style={[styles.label, { color: colors.text }]}>LinkedIn</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.linkedin}
                            onChangeText={(text) => updateField('personal', 'linkedin', text)}
                            placeholder="linkedin.com/in/username"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Portfolio/GitHub</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.personal.portfolio}
                            onChangeText={(text) => updateField('personal', 'portfolio', text)}
                            placeholder="github.com/username"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                        />
                    </View>
                );

            case 'summary':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Professional Summary</Text>
                        <TextInput
                            style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                            value={resume.data.summary}
                            onChangeText={(text) => updateField('summary', null, text)}
                            placeholder="Write a brief summary of your professional background and goals..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={6}
                        />
                    </View>
                );

            case 'experience':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Work Experience</Text>

                        {(resume.data.experience || []).map((exp, index) => (
                            <View key={index} style={[styles.experienceCard, {
                                backgroundColor: colors.background,
                                borderColor: colors.border
                            }]}>
                                {/* Header with job title and delete */}
                                <View style={styles.experienceHeader}>
                                    <View style={styles.titleContainer}>
                                        <Ionicons name="briefcase-outline" size={20} color={colors.text} />
                                        <TextInput
                                            style={[styles.jobTitleInput, { color: colors.text }]}
                                            value={exp.title}
                                            onChangeText={(text) => {
                                                const updated = [...resume.data.experience];
                                                updated[index].title = text;
                                                updateField('experience', null, updated);
                                            }}
                                            placeholder="Job Title"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => removeArrayItem('experience', index)}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                {/* Company */}
                                <View style={styles.companyContainer}>
                                    <Ionicons name="business-outline" size={16} color={colors.text} />
                                    <TextInput
                                        style={[styles.companyInput, { color: colors.text }]}
                                        value={exp.company}
                                        onChangeText={(text) => {
                                            const updated = [...resume.data.experience];
                                            updated[index].company = text;
                                            updateField('experience', null, updated);
                                        }}
                                        placeholder="Company Name"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                {/* Date Range */}
                                <View style={styles.dateRangeContainer}>
                                    <View style={styles.dateField}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.text} />
                                        <TextInput
                                            style={[styles.dateInput, { color: colors.text }]}
                                            value={exp.startDate}
                                            onChangeText={(text) => {
                                                const updated = [...resume.data.experience];
                                                updated[index].startDate = text;
                                                updateField('experience', null, updated);
                                            }}
                                            placeholder="Start"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    <Text style={{ color: colors.text }}>→</Text>
                                    <View style={styles.dateField}>
                                        <Ionicons name="calendar-outline" size={14} color={colors.text} />
                                        <TextInput
                                            style={[styles.dateInput, { color: colors.text }]}
                                            value={exp.endDate}
                                            onChangeText={(text) => {
                                                const updated = [...resume.data.experience];
                                                updated[index].endDate = text;
                                                updateField('experience', null, updated);
                                            }}
                                            placeholder="End"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                {/* Description */}
                                <View style={styles.descriptionContainer}>
                                    <Ionicons name="document-text-outline" size={16} color={colors.text} />
                                    <TextInput
                                        style={[styles.experienceDescription, { color: colors.text }]}
                                        value={exp.description}
                                        onChangeText={(text) => {
                                            const updated = [...resume.data.experience];
                                            updated[index].description = text;
                                            updateField('experience', null, updated);
                                        }}
                                        placeholder="Describe your responsibilities and achievements..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: colors.text }]}
                            onPress={() => {
                                const updated = [...(resume.data.experience || []), {
                                    title: '',
                                    company: '',
                                    startDate: '',
                                    endDate: '',
                                    description: ''
                                }];
                                updateField('experience', null, updated);
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color={colors.text} />
                            <Text style={{ color: colors.text, fontWeight: '500' }}>Add Experience</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'projects':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Projects</Text>

                        {(resume.data.projects || []).map((project, index) => (
                            <View key={index} style={[styles.arrayItem, { borderColor: colors.border }]}>
                                <View style={styles.arrayItemHeader}>
                                    <TextInput
                                        style={[styles.arrayItemTitle, { color: colors.text, flex: 1 }]}
                                        value={project.name}
                                        onChangeText={(text) => {
                                            const updated = [...resume.data.projects];
                                            updated[index].name = text;
                                            updateField('projects', null, updated);
                                        }}
                                        placeholder="Project Name"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <TouchableOpacity onPress={() => removeArrayItem('projects', index)}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={[styles.arrayItemDescription, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                                    value={project.description}
                                    onChangeText={(text) => {
                                        const updated = [...resume.data.projects];
                                        updated[index].description = text;
                                        updateField('projects', null, updated);
                                    }}
                                    placeholder="Project description"
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={2}
                                />

                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, marginTop: 8 }]}
                                    value={project.technologies}
                                    onChangeText={(text) => {
                                        const updated = [...resume.data.projects];
                                        updated[index].technologies = text;
                                        updateField('projects', null, updated);
                                    }}
                                    placeholder="Technologies used (comma separated)"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: colors.text }]}
                            onPress={() => {
                                const updated = [...(resume.data.projects || []), {
                                    name: '',
                                    description: '',
                                    technologies: ''
                                }];
                                updateField('projects', null, updated);
                            }}
                        >
                            <Ionicons name="add" size={20} color={colors.text} />
                            <Text style={{ color: colors.text }}>Add Project</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'education':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Education</Text>

                        {(resume.data.education || []).map((edu, index) => (
                            <View key={index} style={[styles.arrayItem, { borderColor: colors.border }]}>
                                <View style={styles.arrayItemHeader}>
                                    <TextInput
                                        style={[styles.arrayItemTitle, { color: colors.text, flex: 1 }]}
                                        value={edu.degree}
                                        onChangeText={(text) => {
                                            const updated = [...resume.data.education];
                                            updated[index].degree = text;
                                            updateField('education', null, updated);
                                        }}
                                        placeholder="Degree"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <TouchableOpacity onPress={() => removeArrayItem('education', index)}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    style={[styles.arrayItemSubtitle, { color: colors.textSecondary }]}
                                    value={edu.institution}
                                    onChangeText={(text) => {
                                        const updated = [...resume.data.education];
                                        updated[index].institution = text;
                                        updateField('education', null, updated);
                                    }}
                                    placeholder="Institution"
                                    placeholderTextColor="#9CA3AF"
                                />

                                <View style={styles.dateRow}>
                                    <TextInput
                                        style={[styles.dateInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                                        value={edu.year}
                                        onChangeText={(text) => {
                                            const updated = [...resume.data.education];
                                            updated[index].year = text;
                                            updateField('education', null, updated);
                                        }}
                                        placeholder="Year"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: colors.text }]}
                            onPress={() => {
                                const updated = [...(resume.data.education || []), {
                                    degree: 'Bachelor of Science',
                                    institution: 'University Name',
                                    year: '2020'
                                }];
                                updateField('education', null, updated);
                            }}
                        >
                            <Ionicons name="add" size={20} color={colors.text} />
                            <Text style={{ color: colors.text }}>Add Education</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'skills':
                return (
                    <View style={[styles.sectionEditor, { backgroundColor: colors.card }]}>
                        <Text style={[styles.sectionEditorTitle, { color: colors.text }]}>Skills</Text>

                        <View style={styles.skillTags}>
                            {(resume.data.skills || []).map((skill, index) => (
                                <View key={index} style={[styles.skillTag, { backgroundColor: colors.primary + '20' }]}>
                                    <Text style={{ color: colors.primary }}>{skill}</Text>
                                    <TouchableOpacity onPress={() => removeArrayItem('skills', index)}>
                                        <Ionicons name="close-circle" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, marginTop: 10 }]}
                            placeholder="Add a skill and press Enter"
                            placeholderTextColor="#9CA3AF"
                            onSubmitEditing={(e) => {
                                if (e.nativeEvent.text.trim()) {
                                    const updated = [...(resume.data.skills || []), e.nativeEvent.text.trim()];
                                    updateField('skills', null, updated);
                                    e.target.clear();
                                }
                            }}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Resume Builder</Text>
                <TouchableOpacity onPress={generatePDF} disabled={generatingPDF}>
                    {generatingPDF ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Ionicons name="download-outline" size={24} color={colors.primary} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Career Info */}
            <View style={[styles.careerInfo, { backgroundColor: colors.card }]}>
                <Text style={[styles.careerName, { color: colors.text }]}>{career}</Text>
                <TouchableOpacity
                    style={[styles.templateButton, { borderColor: colors.text }]}
                    onPress={() => setShowTemplateModal(true)}
                >
                    <Ionicons name="color-palette-outline" size={16} color={colors.text} />
                    <Text style={{ color: colors.text }}>Change Template</Text>
                </TouchableOpacity>
            </View>

            {/* Section Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
                {['personal', 'summary', 'skills', 'experience', 'projects', 'education'].map(section => (
                    <TouchableOpacity
                        key={section}
                        style={[
                            styles.tab,
                            activeSection === section && styles.activeTab,
                            { borderColor: activeSection === section ? colors.text : 'transparent' }
                        ]}
                        onPress={() => setActiveSection(section)}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeSection === section ? colors.text : colors.text }
                        ]}>
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Section Editor */}
            <ScrollView style={styles.editorContainer}>
                {renderSection()}
            </ScrollView>

            {/* Template Modal */}
            <Modal visible={showTemplateModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Template</Text>
                            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {Object.values(templates).map(template => (
                            <TouchableOpacity
                                key={template.id}
                                style={[
                                    styles.templateOption,
                                    resume.template === template.id && styles.selectedTemplate,
                                    { borderColor: resume.template === template.id ? colors.primary : colors.border }
                                ]}
                                onPress={() => {
                                    setResume({ ...resume, template: template.id });
                                    updateSection(resume.id, 'template', template.id);
                                    setShowTemplateModal(false);
                                }}
                            >
                                <View>
                                    <Text style={[styles.templateName, { color: colors.text }]}>{template.name}</Text>
                                    <Text style={[styles.templateDesc, { color: colors.textSecondary }]}>{template.description}</Text>
                                </View>
                                {resume.template === template.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    careerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    careerName: {
        fontSize: 18,
        fontWeight: '600',
    },
    templateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4,
    },
    tabs: {
        maxHeight: 50,
        paddingHorizontal: 16,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderBottomWidth: 2,
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    editorContainer: {
        flex: 1,
        padding: 16,
    },
    sectionEditor: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    sectionEditorTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    arrayItem: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 8,
    },
    arrayItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderStyle: 'dashed',
        gap: 8,
    },
    skillTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    templateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 12,
    },
    selectedTemplate: {
        borderWidth: 2,
    },
    templateName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    templateDesc: {
        fontSize: 12,
    },
    upgradeButton: {
        padding: 16,
        borderRadius: 8,
        width: '70%',
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrayItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    arrayItemSubtitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    arrayItemDescription: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
        minHeight: 60,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
    },
    experienceCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    jobTitleInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        padding: 0,
    },
    companyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingLeft: 28,
    },
    companyInput: {
        flex: 1,
        fontSize: 14,
        padding: 0,
    },
    dateRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingLeft: 28,
    },
    dateField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    dateInput: {
        flex: 1,
        fontSize: 13,
        padding: 0,
    },
    descriptionContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingLeft: 28,
    },
    experienceDescription: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        minHeight: 60,
        padding: 0,
    },
});