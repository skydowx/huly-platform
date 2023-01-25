//
// Copyright © 2020 Anticrm Platform Contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import type { Class, Client, Data, Doc, DocumentQuery, Ref, Space } from '@hcengineering/core'
import { DOMAIN_MODEL } from '@hcengineering/core'
import { Builder, Mixin, Model } from '@hcengineering/model'
import core, { TClass, TDoc } from '@hcengineering/model-core'
import preference, { TPreference } from '@hcengineering/model-preference'
import presenation from '@hcengineering/model-presentation'
import type { Asset, IntlString, Resource, Status } from '@hcengineering/platform'
import { DOMAIN_PREFERENCE } from '@hcengineering/preference'
import type { AnyComponent, Location } from '@hcengineering/ui'
import type {
  Action,
  ActionCategory,
  ArrayEditor,
  AttributeEditor,
  AttributeFilter,
  AttributePresenter,
  BuildModelKey,
  ClassFilters,
  ClassSortFuncs,
  CollectionEditor,
  CollectionPresenter,
  Filter,
  FilteredView,
  FilterMode,
  IgnoreActions,
  InlineAttributEditor,
  KeyBinding,
  KeyFilter,
  LinkPresenter,
  ListHeaderExtra,
  ListItemPresenter,
  ObjectEditor,
  ObjectEditorHeader,
  ObjectFactory,
  ObjectPresenter,
  ObjectTitle,
  ObjectValidator,
  PreviewPresenter,
  SortFunc,
  SpaceHeader,
  SpaceName,
  ViewAction,
  ViewActionInput,
  ViewContext,
  Viewlet,
  ViewletDescriptor,
  ViewletPreference,
  ViewOptionsModel,
  ViewOptions
} from '@hcengineering/view'
import view from './plugin'

export { viewOperation } from './migration'
export { ViewAction, Viewlet }

export function createAction<T extends Doc = Doc, P = Record<string, any>> (
  builder: Builder,
  data: Data<Action<T, P>>,
  id?: Ref<Action>
): void {
  const { label, ...adata } = data as Data<Action>
  builder.createDoc(view.class.Action, core.space.Model, { label, ...adata }, id)
}

export function classPresenter (
  builder: Builder,
  _class: Ref<Class<Doc>>,
  presenter: AnyComponent,
  editor?: AnyComponent,
  popup?: AnyComponent
): void {
  builder.mixin(_class, core.class.Class, view.mixin.AttributePresenter, {
    presenter
  })
  if (editor !== undefined) {
    builder.mixin(_class, core.class.Class, view.mixin.AttributeEditor, {
      inlineEditor: editor,
      popup
    })
  }
}

@Model(view.class.FilteredView, core.class.Doc, DOMAIN_PREFERENCE)
export class TFilteredView extends TPreference implements FilteredView {
  name!: string
  location!: Location
  filters!: string
  viewOptions?: ViewOptions
  viewletId?: Ref<Viewlet> | null
}

@Model(view.class.FilterMode, core.class.Doc, DOMAIN_MODEL)
export class TFilterMode extends TDoc implements FilterMode {
  label!: IntlString
  result!: Resource<(filter: Filter, onUpdate: () => void) => Promise<any>>
}

@Mixin(view.mixin.ClassFilters, core.class.Class)
export class TClassFilters extends TClass implements ClassFilters {
  filters!: (string | KeyFilter)[]
}

@Mixin(view.mixin.AttributeFilter, core.class.Class)
export class TAttributeFilter extends TClass implements AttributeFilter {
  component!: AnyComponent
}

@Mixin(view.mixin.AttributeEditor, core.class.Class)
export class TAttributeEditor extends TClass implements AttributeEditor {
  inlineEditor!: AnyComponent
}

@Mixin(view.mixin.CollectionPresenter, core.class.Class)
export class TCollectionPresenter extends TClass implements CollectionPresenter {
  presenter!: AnyComponent
}

@Mixin(view.mixin.CollectionEditor, core.class.Class)
export class TCollectionEditor extends TClass implements CollectionEditor {
  editor!: AnyComponent
  inlineEditor?: AnyComponent
}

@Mixin(view.mixin.InlineAttributEditor, core.class.Class)
export class TInlineAttributEditor extends TClass implements InlineAttributEditor {
  editor!: AnyComponent
}

@Mixin(view.mixin.ArrayEditor, core.class.Class)
export class TArrayEditor extends TClass implements ArrayEditor {
  inlineEditor?: AnyComponent
  editor?: AnyComponent
}

@Mixin(view.mixin.AttributePresenter, core.class.Class)
export class TAttributePresenter extends TClass implements AttributePresenter {
  presenter!: AnyComponent
}

@Mixin(view.mixin.ObjectPresenter, core.class.Class)
export class TObjectPresenter extends TClass implements ObjectPresenter {
  presenter!: AnyComponent
}

@Mixin(view.mixin.ListItemPresenter, core.class.Class)
export class TListItemPresenter extends TClass implements ListItemPresenter {
  presenter!: AnyComponent
}

@Mixin(view.mixin.ObjectEditor, core.class.Class)
export class TObjectEditor extends TClass implements ObjectEditor {
  editor!: AnyComponent
  pinned?: boolean
}

@Mixin(view.mixin.ObjectEditorHeader, core.class.Class)
export class TObjectEditorHeader extends TClass implements ObjectEditorHeader {
  editor!: AnyComponent
}

@Mixin(view.mixin.SpaceHeader, core.class.Class)
export class TSpaceHeader extends TClass implements SpaceHeader {
  header!: AnyComponent
}

@Mixin(view.mixin.SpaceName, core.class.Class)
export class TSpaceName extends TClass implements SpaceName {
  getName!: Resource<(client: Client, space: Space) => Promise<string>>
}

@Mixin(view.mixin.ObjectValidator, core.class.Class)
export class TObjectValidator extends TClass implements ObjectValidator {
  validator!: Resource<<T extends Doc>(doc: T, client: Client) => Promise<Status<{}>>>
}

@Mixin(view.mixin.ObjectFactory, core.class.Class)
export class TObjectFactory extends TClass implements ObjectFactory {
  component?: AnyComponent
  create?: Resource<() => Promise<void>>
}

@Mixin(view.mixin.ObjectTitle, core.class.Class)
export class TObjectTitle extends TClass implements ObjectTitle {
  titleProvider!: Resource<<T extends Doc>(client: Client, ref: Ref<T>) => Promise<string>>
}

@Mixin(view.mixin.ListHeaderExtra, core.class.Class)
export class TListHeaderExtra extends TClass implements ListHeaderExtra {
  presenters!: AnyComponent[]
}

@Mixin(view.mixin.SortFuncs, core.class.Class)
export class TSortFuncs extends TClass implements ClassSortFuncs {
  func!: SortFunc
}

@Model(view.class.ViewletPreference, preference.class.Preference)
export class TViewletPreference extends TPreference implements ViewletPreference {
  attachedTo!: Ref<Viewlet>
  config!: (BuildModelKey | string)[]
}

@Model(view.class.ViewletDescriptor, core.class.Doc, DOMAIN_MODEL)
export class TViewletDescriptor extends TDoc implements ViewletDescriptor {
  component!: AnyComponent
  label!: IntlString
}

@Model(view.class.Viewlet, core.class.Doc, DOMAIN_MODEL)
export class TViewlet extends TDoc implements Viewlet {
  attachTo!: Ref<Class<Doc>>
  descriptor!: Ref<ViewletDescriptor>
  open!: AnyComponent
  config!: (BuildModelKey | string)[]
  hiddenKeys?: string[]
  viewOptions?: ViewOptionsModel
}

@Model(view.class.Action, core.class.Doc, DOMAIN_MODEL)
export class TAction extends TDoc implements Action {
  label!: IntlString
  icon!: Asset

  action!: ViewAction
  actionProps!: Record<string, any>
  input!: ViewActionInput

  target!: Ref<Class<Doc>>
  query!: DocumentQuery<Doc>

  inputProps!: Record<string, Ref<Class<Doc>>>
  keyBinding!: KeyBinding[]
  description!: IntlString
  category!: Ref<ActionCategory>
  context!: ViewContext
  secured?: boolean
}

@Model(view.class.ActionCategory, core.class.Doc, DOMAIN_MODEL)
export class TActionCategory extends TDoc implements ActionCategory {
  label!: IntlString
  icon?: Asset
  visible!: boolean
}

@Mixin(view.mixin.IgnoreActions, core.class.Class)
export class TIgnoreActions extends TClass implements IgnoreActions {
  actions!: Ref<Action>[]
}

@Mixin(view.mixin.PreviewPresenter, core.class.Class)
export class TPreviewPresenter extends TClass implements PreviewPresenter {
  presenter!: AnyComponent
}

@Model(view.class.LinkPresenter, core.class.Doc, DOMAIN_MODEL)
export class TLinkPresenter extends TDoc implements LinkPresenter {
  pattern!: string

  component!: AnyComponent
}

export type ActionTemplate = Partial<Data<Action>>

/**
 * @public
 */
export function template<N extends Record<string, ActionTemplate>> (t: N): N {
  return t
}

export const actionTemplates = template({
  move: {
    label: view.string.Move,
    action: view.actionImpl.Move,
    icon: view.icon.Move,
    input: 'focus',
    category: view.category.General
  },
  open: {
    action: view.actionImpl.Open,
    label: view.string.Open,
    icon: view.icon.Open,
    keyBinding: ['Enter'],
    input: 'focus',
    category: view.category.General
  }
})

export function createModel (builder: Builder): void {
  builder.createModel(
    TFilterMode,
    TClassFilters,
    TAttributeFilter,
    TAttributeEditor,
    TAttributePresenter,
    TListItemPresenter,
    TCollectionEditor,
    TCollectionPresenter,
    TObjectEditor,
    TObjectPresenter,
    TSortFuncs,
    TListHeaderExtra,
    TViewletPreference,
    TViewletDescriptor,
    TViewlet,
    TAction,
    TActionCategory,
    TObjectValidator,
    TObjectFactory,
    TObjectTitle,
    TObjectEditorHeader,
    TSpaceHeader,
    TSpaceName,
    TIgnoreActions,
    TPreviewPresenter,
    TLinkPresenter,
    TArrayEditor,
    TInlineAttributEditor,
    TFilteredView
  )

  classPresenter(
    builder,
    core.class.TypeString,
    view.component.StringPresenter,
    view.component.StringEditor,
    view.component.StringEditorPopup
  )
  classPresenter(builder, core.class.TypeAttachment, view.component.StringPresenter)
  classPresenter(
    builder,
    core.class.TypeHyperlink,
    view.component.HyperlinkPresenter,
    view.component.StringEditor,
    view.component.StringEditorPopup
  )
  classPresenter(builder, core.class.TypeIntlString, view.component.IntlStringPresenter)
  classPresenter(builder, core.class.TypeNumber, view.component.NumberPresenter, view.component.NumberEditor)
  classPresenter(
    builder,
    core.class.TypeMarkup,
    view.component.MarkupPresenter,
    view.component.MarkupEditor,
    view.component.MarkupEditorPopup
  )

  builder.mixin(core.class.TypeMarkup, core.class.Class, view.mixin.InlineAttributEditor, {
    editor: view.component.HTMLEditor
  })

  classPresenter(builder, core.class.TypeBoolean, view.component.BooleanPresenter, view.component.BooleanEditor)
  classPresenter(builder, core.class.TypeTimestamp, view.component.TimestampPresenter)
  classPresenter(builder, core.class.TypeDate, view.component.DatePresenter, view.component.DateEditor)
  classPresenter(builder, core.class.Space, view.component.ObjectPresenter)
  classPresenter(builder, core.class.Class, view.component.ClassRefPresenter)
  builder.mixin(core.class.Space, core.class.Class, view.mixin.ObjectPresenter, {
    presenter: view.component.SpacePresenter
  })

  builder.mixin(core.class.Class, core.class.Class, view.mixin.ObjectPresenter, {
    presenter: view.component.ClassPresenter
  })

  classPresenter(builder, core.class.TypeRelatedDocument, view.component.ObjectPresenter)

  builder.createDoc(
    view.class.ActionCategory,
    core.space.Model,
    { label: view.string.General, visible: true },
    view.category.General
  )
  builder.createDoc(
    view.class.ActionCategory,
    core.space.Model,
    { label: view.string.General, visible: false },
    view.category.GeneralNavigation
  )
  builder.createDoc(
    view.class.ActionCategory,
    core.space.Model,
    { label: view.string.Editor, visible: false },
    view.category.Editor
  )
  builder.createDoc(
    view.class.ActionCategory,
    core.space.Model,
    { label: view.string.Navigation, visible: true },
    view.category.Navigation
  )
  builder.createDoc(
    view.class.ActionCategory,
    core.space.Model,
    { label: view.string.MarkdownFormatting, visible: false },
    view.category.MarkdownFormatting
  )

  builder.createDoc(
    view.class.ViewletDescriptor,
    core.space.Model,
    {
      label: view.string.Table,
      icon: view.icon.Table,
      component: view.component.TableBrowser
    },
    view.viewlet.Table
  )

  builder.createDoc(
    view.class.ViewletDescriptor,
    core.space.Model,
    {
      label: view.string.List,
      icon: view.icon.List,
      component: view.component.ListView
    },
    view.viewlet.List
  )

  createAction(
    builder,
    {
      action: view.actionImpl.Delete,
      label: view.string.Delete,
      icon: view.icon.Delete,
      keyBinding: ['Meta + Backspace', 'Ctrl + Backspace'],
      category: view.category.General,
      input: 'any',
      target: core.class.Doc,
      context: { mode: ['context', 'browser'], group: 'tools' }
    },
    view.action.Delete
  )

  // Keyboard actions.
  createAction(
    builder,
    {
      action: view.actionImpl.MoveUp,
      label: view.string.MoveUp,
      keyBinding: ['ArrowUp', 'keyK'],
      category: view.category.GeneralNavigation,
      input: 'none',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.MoveUp
  )

  createAction(
    builder,
    {
      action: view.actionImpl.MoveDown,
      label: view.string.MoveDown,
      keyBinding: ['ArrowDown', 'keyJ'],
      category: view.category.GeneralNavigation,
      input: 'none',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.MoveDown
  )

  createAction(
    builder,
    {
      action: view.actionImpl.MoveLeft,
      label: view.string.MoveLeft,
      keyBinding: ['ArrowLeft'],
      category: view.category.GeneralNavigation,
      input: 'none',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.MoveLeft
  )

  createAction(
    builder,
    {
      action: view.actionImpl.MoveRight,
      label: view.string.MoveRight,
      keyBinding: ['ArrowRight'],
      category: view.category.GeneralNavigation,
      input: 'none',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.MoveRight
  )

  builder.mixin(core.class.Space, core.class.Class, view.mixin.AttributePresenter, {
    presenter: view.component.SpacePresenter
  })

  // Selection stuff
  createAction(
    builder,
    {
      label: view.string.SelectItem,
      action: view.actionImpl.SelectItem,
      keyBinding: ['keyX'],
      category: view.category.General,
      input: 'any',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.SelectItem
  )

  createAction(
    builder,
    {
      label: view.string.SelectItemAll,
      action: view.actionImpl.SelectItemAll,
      keyBinding: ['meta + keyA', 'ctrl + keyA'],
      category: view.category.General,
      input: 'none',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.SelectItemAll
  )

  createAction(
    builder,
    {
      action: view.actionImpl.SelectItemNone,
      label: view.string.SelectItemNone,
      keyBinding: ['escape'],
      category: view.category.General,
      input: 'selection',
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.SelectItemNone
  )

  createAction(
    builder,
    {
      action: view.actionImpl.ShowActions,
      label: view.string.ShowActions,
      keyBinding: ['meta + keyK', 'ctrl + keyK'],
      category: view.category.GeneralNavigation,
      input: 'none',
      target: core.class.Doc,
      context: {
        mode: ['workbench', 'browser', 'panel', 'editor', 'input']
      }
    },
    view.action.ShowActions
  )

  createAction(
    builder,
    {
      action: view.actionImpl.ShowPreview,
      label: view.string.ShowPreview,
      keyBinding: ['Space'],
      input: 'focus',
      category: view.category.General,
      target: core.class.Doc,
      context: { mode: 'browser' }
    },
    view.action.ShowPreview
  )

  builder.createDoc(view.class.LinkPresenter, core.space.Model, {
    pattern: '(www.)?youtube.(com|ru)',
    component: view.component.YoutubePresenter
  })

  builder.createDoc(view.class.LinkPresenter, core.space.Model, {
    pattern: '(www.)?github.com/',
    component: view.component.GithubPresenter
  })

  builder.mixin(core.class.TypeString, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.TypeHyperlink, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.TypeBoolean, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.TypeNumber, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.TypeDate, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.EnumOf, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ValueFilter
  })

  builder.mixin(core.class.RefTo, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.ObjectFilter
  })

  builder.mixin(core.class.TypeTimestamp, core.class.Class, view.mixin.AttributeFilter, {
    component: view.component.TimestampFilter
  })

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.FilterIsEither,
      result: view.function.FilterValueInResult
    },
    view.filter.FilterValueIn
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.FilterIsNot,
      result: view.function.FilterValueNinResult
    },
    view.filter.FilterValueNin
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.FilterIsEither,
      result: view.function.FilterObjectInResult
    },
    view.filter.FilterObjectIn
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.FilterIsNot,
      result: view.function.FilterObjectNinResult
    },
    view.filter.FilterObjectNin
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.Before,
      result: view.function.FilterBeforeResult
    },
    view.filter.FilterBefore
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.After,
      result: view.function.FilterAfterResult
    },
    view.filter.FilterAfter
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.MatchCriteria,
      result: view.function.FilterNestedMatchResult
    },
    view.filter.FilterNestedMatch
  )

  builder.createDoc(
    view.class.FilterMode,
    core.space.Model,
    {
      label: view.string.DontMatchCriteria,
      result: view.function.FilterNestedDontMatchResult
    },
    view.filter.FilterNestedDontMatch
  )

  classPresenter(builder, core.class.EnumOf, view.component.StringPresenter, view.component.EnumEditor)

  createAction(builder, {
    action: view.actionImpl.ShowPopup,
    actionProps: {
      component: view.component.IndexedDocumentPreview,
      fillProps: {
        _id: 'objectId'
      }
    },
    label: presenation.string.DocumentPreview,
    keyBinding: [''],
    input: 'focus',
    icon: view.icon.Open,
    category: view.category.GeneralNavigation,
    target: core.class.Doc,
    context: { mode: ['context', 'browser', 'editor'] }
  })
}

export default view
