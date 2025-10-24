import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "hello-pangea/dnd";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GripVertical, Eye, EyeOff, Settings, Save } from "lucide-react";

// Install required dependency: npm install react-beautiful-dnd

export default function LayoutEditor() {
  const [layout, setLayout] = useState(null);
  const [saving, setSaving] = useState(false);

  const defaultLayout = {
    sections: [
      {
        id: "hero",
        type: "hero",
        enabled: true,
        title: "Hero Section",
        config: {
          style: "gradient",
          showCTAs: true,
        },
      },
      {
        id: "featured",
        type: "featured-posts",
        enabled: true,
        title: "Featured Posts",
        config: {
          limit: 3,
          style: "cards",
        },
      },
      {
        id: "recent",
        type: "recent-posts",
        enabled: true,
        title: "Recent Posts",
        config: {
          limit: 6,
          style: "grid",
        },
      },
      {
        id: "newsletter",
        type: "newsletter",
        enabled: true,
        title: "Newsletter Signup",
        config: {
          title: "Stay Safe & Informed",
          description:
            "Get the latest safety tips and resources delivered to your inbox.",
        },
      },
      {
        id: "resources",
        type: "emergency-resources",
        enabled: true,
        title: "Emergency Resources",
        config: {
          showContacts: true,
          showSafetyPlan: true,
        },
      },
    ],
  };

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    try {
      const layoutDoc = await getDoc(doc(db, "site", "layout"));
      if (layoutDoc.exists()) {
        setLayout(layoutDoc.data());
      } else {
        setLayout(defaultLayout);
      }
    } catch (error) {
      console.error("Error loading layout:", error);
      setLayout(defaultLayout);
    }
  };

  const saveLayout = async () => {
    if (!layout) return;

    setSaving(true);
    try {
      await setDoc(doc(db, "site", "layout"), layout);
      // Show success message
      alert("Layout saved successfully!");
    } catch (error) {
      console.error("Error saving layout:", error);
      alert("Error saving layout");
    } finally {
      setSaving(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination || !layout) return;

    const sections = Array.from(layout.sections);
    const [reorderedItem] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedItem);

    setLayout({
      ...layout,
      sections,
    });
  };

  const toggleSection = (sectionId) => {
    if (!layout) return;

    const updatedSections = layout.sections.map((section) =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    );

    setLayout({
      ...layout,
      sections: updatedSections,
    });
  };

  const updateSectionConfig = (sectionId, key, value) => {
    if (!layout) return;

    const updatedSections = layout.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            config: {
              ...section.config,
              [key]: value,
            },
          }
        : section
    );

    setLayout({
      ...layout,
      sections: updatedSections,
    });
  };

  if (!layout) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Layout Editor</h1>
        <button
          onClick={saveLayout}
          disabled={saving}
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Layout"}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Drag and drop sections to rearrange the homepage layout. Toggle
          visibility and configure each section.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {layout.sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-4">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {section.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Type: {section.type}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleSection(section.id)}
                              className={`p-2 rounded-full ${
                                section.enabled
                                  ? "text-green-600 bg-green-50"
                                  : "text-gray-400 bg-gray-100"
                              }`}
                            >
                              {section.enabled ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </button>

                            <Settings className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>

                        {section.enabled && (
                          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {section.type === "featured-posts" && (
                                <>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Post Limit
                                    </label>
                                    <input
                                      type="number"
                                      value={section.config.limit || 3}
                                      onChange={(e) =>
                                        updateSectionConfig(
                                          section.id,
                                          "limit",
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                                      min="1"
                                      max="6"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Style
                                    </label>
                                    <select
                                      value={section.config.style || "cards"}
                                      onChange={(e) =>
                                        updateSectionConfig(
                                          section.id,
                                          "style",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                                    >
                                      <option value="cards">Cards</option>
                                      <option value="grid">Grid</option>
                                      <option value="list">List</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {section.type === "newsletter" && (
                                <>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={section.config.title || ""}
                                      onChange={(e) =>
                                        updateSectionConfig(
                                          section.id,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={section.config.description || ""}
                                      onChange={(e) =>
                                        updateSectionConfig(
                                          section.id,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      rows={2}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Preview Note</h3>
        <p className="text-yellow-700 text-sm">
          Changes will be reflected on the homepage after saving. Disabled
          sections will be hidden from the public view.
        </p>
      </div>
    </div>
  );
}
